import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render } from '@/lib/test-render';
import RecordingBar from '../recording-bar';
import { useScreenRecording } from '@/hooks/useScreenRecording';
import { toaster } from '@/components/ui/toaster';
import { initialOptions } from '@/lib/defaults';

// Mock the useScreenRecording hook
vi.mock('@/hooks/useScreenRecording');

// Mock the Toaster component
vi.mock('@/components/ui/toaster', () => ({
	Toaster: () => <div data-testid="toaster" />,
	toaster: {
		create: vi.fn(),
		dismiss: vi.fn(),
	},
}));

describe('RecordingBar', () => {
	const mockProps = {
		options: {
			...initialOptions,
			videoLength: 5,
			transitionDuration: 1,
			featureId: 'test-feature',
		},
		setHideWidget: vi.fn(),
		setHideUI: vi.fn(),
		dispatch: vi.fn(),
		hideUI: false,
		hideWidget: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useScreenRecording).mockReturnValue({
			startRecording: vi.fn(),
			stopRecording: vi.fn(),
			videoUrl: '',
			videoProcessing: false,
			status: 'inactive',
			stream: null,
			videoChunks: [],
		});
	});

	test('Record button is rendered when not recording', () => {
		render(<RecordingBar {...mockProps} />);

		expect(screen.getByTestId('record-button')).toBeInTheDocument();
		expect(screen.getByText('Record')).toBeInTheDocument();
	});

	test('Processing state is shown when video is being processed', () => {
		vi.mocked(useScreenRecording).mockReturnValue({
			startRecording: vi.fn(),
			stopRecording: vi.fn(),
			videoUrl: '',
			videoProcessing: true,
			status: 'inactive',
			stream: null,
			videoChunks: [],
		});

		render(<RecordingBar {...mockProps} />);

		// Look for the spinner element within the button
		const processingButton = screen.getByRole('button', { name: /processing/i });
		expect(processingButton).toBeInTheDocument();
		expect(processingButton).toBeDisabled();
		expect(processingButton.querySelector('.chakra-spinner')).toBeInTheDocument();
	});

	test('Preview and download buttons are shown when video is ready', () => {
		vi.mocked(useScreenRecording).mockReturnValue({
			startRecording: vi.fn(),
			stopRecording: vi.fn(),
			videoUrl: 'https://example.com/video.mp4',
			videoProcessing: false,
			status: 'finished',
			stream: null,
			videoChunks: [],
		});

		render(<RecordingBar {...mockProps} />);

		expect(screen.getByTestId('preview-button')).toBeInTheDocument();
		expect(screen.getByTestId('download-button')).toBeInTheDocument();
	});

	test('Recording start is handled correctly', async () => {
		const mockStartRecording = vi.fn().mockImplementation(async () => {
			mockProps.setHideWidget(true);
			mockProps.setHideUI(true);
		});
		vi.mocked(useScreenRecording).mockReturnValue({
			startRecording: mockStartRecording,
			stopRecording: vi.fn(),
			videoUrl: '',
			videoProcessing: false,
			status: 'inactive',
			stream: null,
			videoChunks: [],
		});

		render(<RecordingBar {...mockProps} />);

		const recordButton = screen.getByTestId('record-button');
		fireEvent.click(recordButton);

		await waitFor(() => {
			expect(mockStartRecording).toHaveBeenCalled();
			expect(mockProps.setHideWidget).toHaveBeenCalledWith(true);
			expect(mockProps.setHideUI).toHaveBeenCalledWith(true);
		});
	});

	test('Success toast is shown when recording is finished', async () => {
		const mockStartRecording = vi.fn().mockImplementation(async () => {
			mockProps.setHideWidget(true);
			mockProps.setHideUI(true);
			// Simulate recording completion
			mockProps.setHideWidget(false);
			mockProps.setHideUI(false);
		});
		vi.mocked(useScreenRecording).mockReturnValue({
			startRecording: mockStartRecording,
			stopRecording: vi.fn(),
			videoUrl: 'https://example.com/video.mp4',
			videoProcessing: false,
			status: 'finished',
			stream: null,
			videoChunks: [],
		});

		render(<RecordingBar {...mockProps} />);

		fireEvent.click(screen.getByTestId('record-button'));

		await waitFor(() => {
			expect(mockProps.setHideUI).toHaveBeenCalledWith(false);
			expect(mockProps.setHideWidget).toHaveBeenCalledWith(false);
			expect(toaster.create).toHaveBeenCalledWith({
				title: 'Video Successfully Recorded',
				type: 'success',
			});
		});
	});
});
