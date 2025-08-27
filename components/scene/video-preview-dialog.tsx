import { useRef, useState } from 'react';
import { Button, Dialog, Portal, Link } from '@chakra-ui/react';
import { TbDownload } from 'react-icons/tb';
import { DialogCloseTrigger } from '@/components/ui/dialog';

type VideoPreviewDialogProps = {
	videoUrl: string;
	featureId: string;
};

export function VideoPreviewDialog({ videoUrl, featureId }: VideoPreviewDialogProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [videoDimensions, setVideoDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const handleVideoLoad = () => {
		if (videoRef.current) {
			const { videoWidth, videoHeight } = videoRef.current;
			setVideoDimensions({ width: videoWidth, height: videoHeight });
		}
	};

	return (
		<>
			<Dialog.Root size="xl" placement="center">
				<Dialog.Trigger asChild>
					<Button
						variant="outline"
						size="md"
						data-testid="preview-button"
						className={`plausible-event-name=Preview plausible-event-feature=${featureId}`}
					>
						Preview
					</Button>
				</Dialog.Trigger>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header
								display="flex"
								// justifyContent="space-between"
								// alignItems="center"
							>
								<Dialog.Title>Video Preview</Dialog.Title>
								<DialogCloseTrigger top="22px" right="25px" />
							</Dialog.Header>
							<Dialog.Body>
								<video
									ref={videoRef}
									id="videoElement"
									controls
									src={videoUrl}
									data-testid="preview-video"
									controlsList="play timeline volume download"
									onLoadedMetadata={handleVideoLoad}
									style={{
										maxWidth: '100%',
										maxHeight: '70vh',
										objectFit: 'contain',
										aspectRatio: videoDimensions
											? `${videoDimensions.width} / ${videoDimensions.height}`
											: 'auto',
									}}
								/>
							</Dialog.Body>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
			<Button size="md" asChild>
				<Link
					href={videoUrl}
					download={`baseline-status-${featureId}.mp4`}
					target="_blank"
					data-testid="download-button"
					className={`plausible-event-name=Download plausible-event-feature=${featureId}`}
				>
					<TbDownload />
					Download
				</Link>
			</Button>
		</>
	);
}
