import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { render } from '@/lib/test-render';
import { VideoPreviewDialog } from '../video-preview-dialog';

describe('Video Preview Dialog', () => {
	const mockProps = {
		videoUrl: 'https://example.com/video.mp4',
		featureId: 'test-feature',
	};

	test('Preview and download buttons are rendered', () => {
		render(<VideoPreviewDialog {...mockProps} />);

		expect(screen.getByTestId('preview-button')).toBeInTheDocument();
		expect(screen.getByTestId('download-button')).toBeInTheDocument();
	});

	test('Download link has correct attributes', () => {
		render(<VideoPreviewDialog {...mockProps} />);

		const downloadLink = screen.getByTestId('download-button');
		expect(downloadLink).toHaveAttribute('href', mockProps.videoUrl);
		expect(downloadLink).toHaveAttribute(
			'download',
			`baseline-status-${mockProps.featureId}.mp4`
		);
		expect(downloadLink).toHaveAttribute('target', '_blank');
	});

	test('Dialog opens when preview button is clicked', async () => {
		render(<VideoPreviewDialog {...mockProps} />);

		const previewButton = screen.getByTestId('preview-button');

		// Click the preview button to open the dialog
		await act(async () => {
			fireEvent.click(previewButton);
		});

		// Wait for the dialog to open and check that the button state changes
		await waitFor(() => {
			expect(previewButton).toHaveAttribute('aria-expanded', 'true');
		});
	});
});
