import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

type UseScreenRecordingProps = {
	videoLength: number;
	transitionDuration: number;
	videoDelay: number;
	setHideWidget: (hide: boolean) => void;
	setHideUI: (hide: boolean) => void;
};

export type MediaRecorderStatus =
	| 'inactive'
	| 'recording'
	| 'finished'
	| 'error'
	| 'aborted'
	| 'permission-denied';

type UseScreenRecordingReturn = {
	startRecording: () => Promise<MediaRecorderStatus | void>;
	stopRecording: () => void;
	videoUrl: string;
	videoProcessing: boolean;
	status: MediaRecorderStatus;
	stream: MediaStream | null;
	videoChunks: BlobPart[];
};

export function useScreenRecording({
	videoLength,
	transitionDuration,
	videoDelay,
	setHideWidget,
	setHideUI,
}: UseScreenRecordingProps): UseScreenRecordingReturn {
	// State
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [videoUrl, setVideoUrl] = useState('');
	const [videoProcessing, setVideoProcessing] = useState(false);
	const [videoChunks, setVideoChunks] = useState<BlobPart[]>([]);
	const [status, setStatus] = useState<MediaRecorderStatus>('inactive');
	const [mimetype, setMimetype] = useState('video/x-matroska;codecs=avc1');

	// Refs for managing recording state and cleanup
	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const isRecording = useRef(false);
	const pendingTimeouts = useRef<number[]>([]);

	/**
	 * Creates a promise that resolves after the specified milliseconds
	 * and tracks the timeout ID for cleanup
	 */
	const timeout = (ms: number): Promise<void> => {
		return new Promise((resolve) => {
			const timeoutId = window.setTimeout(resolve, ms);
			pendingTimeouts.current.push(timeoutId);
		});
	};

	/**
	 * Clears all pending timeouts
	 */
	const clearAllTimeouts = () => {
		pendingTimeouts.current.forEach((id) => window.clearTimeout(id));
		pendingTimeouts.current = [];
	};

	/**
	 * Resets all state and cleans up resources
	 */
	const cleanup = () => {
		isRecording.current = false;
		clearAllTimeouts();
		setVideoChunks([]);
		setVideoUrl('');
		setHideWidget(false);
		setHideUI(false);
		mediaRecorder.current = null;
		setStream(null);
	};

	/**
	 * Converts WebM video to MP4 format using FFmpeg
	 * or alternatively, fixes capptured MP4 format
	 */
	const processMP4 = async (webmBlob: string): Promise<Blob> => {
		const recordingMimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'mp4' : 'webm';
		const ffmpeg = new FFmpeg();
		await ffmpeg.load();
		const fileData = await fetchFile(webmBlob);
		await ffmpeg.writeFile(`input.${recordingMimeType}`, fileData);

		if (recordingMimeType === 'mp4') {
			await ffmpeg.exec([
				'-i',
				`input.${recordingMimeType}`,
				'-c:v',
				'copy',
				'-an', // No audio
				'output.mp4',
			]);
		} else {
			await ffmpeg.exec([
				'-i',
				`input.${recordingMimeType}`,
				'-c:v',
				'libx264',
				'-preset',
				'ultrafast', // Fastest encoding
				'-crf',
				'30', // Lower quality = faster
				'-an', // No audio
				'output.mp4',
			]);
		}
		const mp4Data = (await ffmpeg.readFile(`output.mp4`)) as BlobPart;
		return new Blob([mp4Data], { type: `video/mp4` });
	};

	/**
	 * Starts the screen recording process
	 * 1. Gets screen share stream
	 * 2. Sets up media recorder
	 * 3. Records for specified duration
	 * 4. Processes the video
	 */
	const startRecording = async () => {
		setVideoChunks([]);
		setStatus('recording');
		isRecording.current = true;

		try {
			// Get screen share stream
			const streamData = await navigator.mediaDevices.getDisplayMedia({
				video: {
					frameRate: { ideal: 60, max: 60 },
				},
				// @ts-expect-error This is supported in modern browsers
				preferCurrentTab: true,
			});
			setStream(streamData);

			// Handle screen share ending
			streamData.getVideoTracks()[0].addEventListener('ended', () => {
				// console.log('[Screen Recording] Screen share ended by user');
				setStatus('aborted');
				cleanup();
			});

			// Hide UI initially
			setHideWidget(true);
			setHideUI(true);

			const recordingMimeType = MediaRecorder.isTypeSupported('video/mp4')
				? 'mp4'
				: 'webm';

			// Set up media recorder
			const media = new MediaRecorder(streamData, {
				videoBitsPerSecond: 400000000,
				mimeType: `video/${recordingMimeType}`,
			});
			mediaRecorder.current = media;

			// Initial delay before starting recording
			const delay = transitionDuration + 1;
			await timeout(delay * 1000);

			// Start recording
			mediaRecorder.current.start();
			setVideoUrl('');

			// Handle video chunks
			mediaRecorder.current.ondataavailable = (event) => {
				if (event.data.size <= 0) return;
				if (isRecording.current) {
					setVideoChunks((prevChunks) => [...prevChunks, event.data]);
				}
			};

			// Handle recording stop
			mediaRecorder.current.onstop = async (e) => {
				if (e.target && (e.target as MediaRecorder).mimeType) {
					setMimetype((e.target as MediaRecorder).mimeType);
				}

				if (isRecording.current) {
					setStatus('finished');
				}
				isRecording.current = false;
			};

			// Show widget during recording
			setHideWidget(false);

			// Record for specified duration
			await timeout((videoLength + delay) * 1000);

			// Hide widget before stopping
			setHideWidget(true);
			await timeout(delay * 1000);

			// Stop recording
			if (mediaRecorder.current?.state === 'recording') {
				mediaRecorder.current.stop();
			}
			streamData.getTracks().forEach((track) => track.stop());

			// Show UI again
			setHideUI(false);
			await timeout(videoDelay * 1000);
			setHideWidget(false);
		} catch (error) {
			let status: MediaRecorderStatus = 'aborted';
			console.error('[Screen Recording] Recording failed:', error);

			if (error instanceof Error && error.message.includes('denied')) {
				status = 'permission-denied';
			}

			cleanup();
			setStatus(status);
			return status;
		}
	};

	/**
	 * Stops the current recording if active
	 */
	const stopRecording = () => {
		if (mediaRecorder.current?.state === 'recording') {
			mediaRecorder.current.stop();
			stream?.getTracks().forEach((track) => track.stop());
		}
	};

	/**
	 * Process video when recording is finished
	 */
	useEffect(() => {
		if (status === 'finished' && videoChunks.length > 0) {
			// console.log('[Screen Recording] Processing video...');
			const processVideo = async () => {
				const videoBlob = new Blob(videoChunks, { type: mimetype });
				const reader = new FileReader();

				reader.onload = async () => {
					const result = reader.result;
					if (typeof result !== 'string') {
						setStatus('error');
						return;
					}
					setVideoProcessing(true);
					try {
						// console.log('[Screen Recording] Video processing complete');
						const mp4Blob = await processMP4(result);
						const videoUrl = URL.createObjectURL(mp4Blob);
						setVideoUrl(videoUrl);
					} catch (error) {
						console.error('[Screen Recording] Video processing failed:', error);
						setStatus('error');
					} finally {
						setVideoProcessing(false);
					}
				};

				reader.onerror = () => {
					console.error('[Screen Recording] Error reading video file');
					setStatus('error');
				};

				reader.readAsDataURL(videoBlob);
			};

			processVideo();
		}
	}, [status, videoChunks, mimetype]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			clearAllTimeouts();
		};
	}, []);

	return {
		startRecording,
		stopRecording,
		videoUrl,
		videoProcessing,
		status,
		stream,
		videoChunks,
	};
}
