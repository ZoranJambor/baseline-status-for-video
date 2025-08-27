// Chakra UI
import { Button, Spinner, Box } from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';

// Icons
import { TbPlayerRecord } from 'react-icons/tb';

// Lib & utils
import { OptionsProps } from '@/lib/definitions';
import { initialOptions } from '@/lib/defaults';
import { useScreenRecording } from '@/hooks/useScreenRecording';
import { VideoPreviewDialog } from './video-preview-dialog';
import queueMicrotask from 'queue-microtask';

// Styles
import pageStyles from '@/app/page.module.css';
import recordingbarStyles from '@/components/scene/recording-bar.module.css';

import { useEffect } from 'react';

export default function RecordingBar({
	options,
	setHideWidget = () => {},
	setHideUI = () => {},
}: OptionsProps) {
	const { startRecording, videoUrl, videoProcessing, status } = useScreenRecording({
		videoLength: options.videoLength,
		transitionDuration: options.transitionDuration,
		videoDelay: initialOptions.videoDelay,
		setHideWidget,
		setHideUI,
	});

	useEffect(() => {
		queueMicrotask(() => {
			if (status === 'aborted') {
				toaster.create({
					title: 'Recording Failed',
					description: 'Screen recording was cancelled or failed to start',
					type: 'error',
				});
			} else if (status === 'error') {
				toaster.create({
					title: 'Video Processing Failed',
					description: 'Failed to process the recorded video',
					type: 'error',
				});
			} else if (status === 'finished' && videoUrl) {
				toaster.create({
					title: 'Video Successfully Recorded',
					type: 'success',
				});
			}
		});
	}, [status, videoUrl]);

	const handleStartRecording = async () => {
		toaster.dismiss();
		await startRecording();
	};

	return (
		<>
			<Box className={`${pageStyles.container} ${recordingbarStyles.container}`}>
				{videoProcessing ? (
					<Button disabled variant="outline">
						<Spinner size="xs" /> Processing
					</Button>
				) : (
					<Button
						aria-label="Record Video"
						variant="outline"
						onClick={handleStartRecording}
						size="md"
						data-testid="record-button"
						className={`plausible-event-name=Record plausible-event-feature=${options.featureId}`}
					>
						<TbPlayerRecord color="red" /> Record
					</Button>
				)}

				{videoUrl && (
					<VideoPreviewDialog videoUrl={videoUrl} featureId={options.featureId} />
				)}
			</Box>

			<Toaster />
		</>
	);
}
