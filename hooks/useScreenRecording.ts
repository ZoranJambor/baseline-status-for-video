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

/**
 * Custom hook for screen recording functionality with video processing.
 * Handles the complete recording pipeline: screen capture, video encoding, and MP4 conversion.
 * Uses FFmpeg.wasm for client-side video processing to ensure cross-browser compatibility.
 */
export function useScreenRecording({
	videoLength,
	transitionDuration,
	videoDelay,
	setHideWidget,
	setHideUI,
}: UseScreenRecordingProps): UseScreenRecordingReturn {
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
	 * Converts recorded video to MP4 format using FFmpeg.wasm for cross-browser compatibility.
	 * Handles both WebM and MP4 input formats:
	 * - For MP4: Uses stream copy for faster processing (no re-encoding)
	 * - For WebM: Re-encodes to H.264 with optimized settings for speed
	 */
	const processMP4 = async (webmBlob: string): Promise<Blob> => {
		const recordingMimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'mp4' : 'webm';
		const ffmpeg = new FFmpeg();
		await ffmpeg.load();
		const fileData = await fetchFile(webmBlob);
		await ffmpeg.writeFile(`input.${recordingMimeType}`, fileData);

		if (recordingMimeType === 'mp4') {
			// Stream copy for MP4 input - much faster as no re-encoding needed
			await ffmpeg.exec([
				'-i',
				`input.${recordingMimeType}`,
				'-c:v',
				'copy',
				'-an', // Remove audio track
				'output.mp4',
			]);
		} else {
			// Re-encode WebM to H.264 with speed-optimized settings
			await ffmpeg.exec([
				'-i',
				`input.${recordingMimeType}`,
				'-c:v',
				'libx264',
				'-preset',
				'ultrafast', // Fastest encoding preset
				'-crf',
				'30', // Balanced quality/size ratio
				'-an', // Remove audio track
				'output.mp4',
			]);
		}
		const mp4Data = (await ffmpeg.readFile(`output.mp4`)) as BlobPart;
		return new Blob([mp4Data], { type: `video/mp4` });
	};

	/**
	 * Orchestrates the complete screen recording workflow:
	 * 1. Requests screen share permission and gets media stream
	 * 2. Sets up MediaRecorder with optimal settings
	 * 3. Manages UI visibility during recording phases
	 * 4. Records for the specified duration with proper timing
	 * 5. Handles cleanup and error states
	 */
	const startRecording = async () => {
		setVideoChunks([]);
		setStatus('recording');
		isRecording.current = true;

		try {
			// Request screen share with high frame rate for smooth recording
			const streamData = await navigator.mediaDevices.getDisplayMedia({
				video: {
					frameRate: { ideal: 60, max: 60 },
				},
				// @ts-expect-error This is supported in modern browsers
				preferCurrentTab: true, // Prefer current tab over entire screen
			});
			setStream(streamData);

			// Handle user ending screen share manually
			streamData.getVideoTracks()[0].addEventListener('ended', () => {
				setStatus('aborted');
				cleanup();
			});

			// Hide UI elements for clean recording
			setHideWidget(true);
			setHideUI(true);

			// Choose optimal recording format based on browser support
			const recordingMimeType = MediaRecorder.isTypeSupported('video/mp4')
				? 'mp4'
				: 'webm';

			// Configure MediaRecorder with high bitrate for quality
			const media = new MediaRecorder(streamData, {
				videoBitsPerSecond: 400000000, // 400 Mbps for high quality
				mimeType: `video/${recordingMimeType}`,
			});
			mediaRecorder.current = media;

			// Wait for transition animation to complete before recording
			const delay = transitionDuration + 1;
			await timeout(delay * 1000);

			// Start the actual recording
			mediaRecorder.current.start();
			setVideoUrl('');

			// Collect video data chunks as they become available
			mediaRecorder.current.ondataavailable = (event) => {
				if (event.data.size <= 0) return;
				if (isRecording.current) {
					setVideoChunks((prevChunks) => [...prevChunks, event.data]);
				}
			};

			// Handle recording completion
			mediaRecorder.current.onstop = async (e) => {
				if (e.target && (e.target as MediaRecorder).mimeType) {
					setMimetype((e.target as MediaRecorder).mimeType);
				}

				if (isRecording.current) {
					setStatus('finished');
				}
				isRecording.current = false;
			};

			// Show the widget during recording so it appears in the video
			setHideWidget(false);

			// Record for the specified duration plus initial delay
			await timeout((videoLength + delay) * 1000);

			// Hide widget before stopping to avoid capturing the stop transition
			setHideWidget(true);
			await timeout(delay * 1000);

			// Stop recording and clean up media stream
			if (mediaRecorder.current?.state === 'recording') {
				mediaRecorder.current.stop();
			}
			streamData.getTracks().forEach((track) => track.stop());

			// Restore UI visibility
			setHideUI(false);
			await timeout(videoDelay * 1000);
			setHideWidget(false);
		} catch (error) {
			let status: MediaRecorderStatus = 'aborted';
			console.error('[Screen Recording] Recording failed:', error);

			// Distinguish between permission denied and other errors
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
	 * Automatically processes recorded video chunks when recording finishes.
	 * Converts the raw video data to a downloadable MP4 file using FFmpeg.
	 */
	useEffect(() => {
		if (status === 'finished' && videoChunks.length > 0) {
			const processVideo = async () => {
				// Combine all video chunks into a single blob
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
						// Convert to MP4 format using FFmpeg
						const mp4Blob = await processMP4(result);

						// Create object URL for download/preview
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

				// Read blob as data URL for FFmpeg processing
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
