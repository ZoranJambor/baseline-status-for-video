/*
 * useScreenRecording.test.ts
 *
 * Main test suite for the useScreenRecording hook.
 *
 * This file contains the actual test cases organized by functionality:
 * - Initial state management
 * - Recording start/stop functionality
 * - UI state transitions during recording
 * - Video processing with FFmpeg
 * - Error handling for various failure scenarios
 * - Cleanup and resource management
 *
 * The test logic is separated into modular files:
 * - useScreenRecording.setup.ts - Mock setup and configuration
 * - useScreenRecording.helpers.ts - Helper functions and utilities
 */

import { renderHook } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { useScreenRecording } from '../useScreenRecording';
import { initialOptions } from '@/lib/defaults';
import { mockMediaRecorderInstance } from '../__mocks__/mediaRecorder';

// Import setup and helpers from modular files
import {
	TEST_CONSTANTS,
	mockSetHideWidget,
	mockSetHideUI,
} from './useScreenRecording.setup';

import {
	createMockBlob,
	createMockVideoTrack,
	renderScreenRecordingHook,
	fastForward,
	expectInitialState,
	expectRecordingStopped,
	expectUIVisible,
	expectVideoProcessingComplete,
	expectVideoProcessingError,
	completeRecordingFlow,
	simulateFileReaderErrorFlow,
	simulateScreenShareEnd,
	startRecording,
	stopRecording,
	setupMockStreamWithTrack,
} from './useScreenRecording.helpers';

// =====================
// Test Suite
// =====================

describe('Screen Recording Hook', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('Initial State', () => {
		test('Initializes with default values', () => {
			const { result } = renderScreenRecordingHook();
			expectInitialState(result);
		});
	});

	describe('Recording Process', () => {
		test(
			'Handles UI state changes during recording',
			async () => {
				const { result } = renderScreenRecordingHook();

				// Start recording and verify initial UI hiding
				await startRecording(result);
				expect(mockSetHideWidget).toHaveBeenNthCalledWith(1, true);
				expect(mockSetHideUI).toHaveBeenNthCalledWith(1, true);

				// After transition delay, widget should be visible
				await fastForward(TEST_CONSTANTS.DELAY);
				expect(mockSetHideWidget).toHaveBeenNthCalledWith(2, false);

				// After video length + transition, widget should be hidden again
				await fastForward((TEST_CONSTANTS.VIDEO_LENGTH + TEST_CONSTANTS.DELAY) * 1000);
				expect(mockSetHideWidget).toHaveBeenNthCalledWith(3, true);

				// After transition delay, UI should be visible
				await fastForward(TEST_CONSTANTS.DELAY * 1000);
				expect(mockSetHideUI).toHaveBeenNthCalledWith(2, false);

				// After final transition, widget should be visible again
				await fastForward(TEST_CONSTANTS.DELAY * 1000);
				expect(mockSetHideWidget).toHaveBeenNthCalledWith(4, false);
			},
			TEST_CONSTANTS.RECORDING_TIMEOUT
		);

		test('Stops recording when stopRecording is called', async () => {
			const { result } = renderScreenRecordingHook();

			await startRecording(result);
			// Set MediaRecorder state to recording
			(mockMediaRecorderInstance as { state: string }).state = 'recording';

			await stopRecording(result);

			expectRecordingStopped();
		});

		test('Handles screen share ending by user', async () => {
			const mockVideoTrack = createMockVideoTrack();
			setupMockStreamWithTrack(mockVideoTrack);

			const { result } = renderScreenRecordingHook();

			await startRecording(result);
			await simulateScreenShareEnd(mockVideoTrack);

			// Verify the hook handles screen share ending gracefully
			expect(result.current.status).toBe('aborted');
			expect(result.current.stream).toBeNull();
			expect(result.current.videoUrl).toBe('');
			expectUIVisible();
		});

		test('Stops MediaRecorder and tracks when recording ends', async () => {
			const { result } = renderScreenRecordingHook();

			await startRecording(result);
			// Set MediaRecorder state to recording
			(mockMediaRecorderInstance as { state: string }).state = 'recording';

			await stopRecording(result);

			expectRecordingStopped();
		});
	});

	describe('Video Processing', () => {
		test(
			'Processes video when recording is finished',
			async () => {
				const { result } = renderScreenRecordingHook();
				const mockBlob = createMockBlob();

				await startRecording(result);
				await completeRecordingFlow(result, mockBlob);

				expectVideoProcessingComplete(result);
			},
			TEST_CONSTANTS.PROCESSING_TIMEOUT
		);

		test(
			'Handles video processing errors gracefully',
			async () => {
				// Mock console.error to avoid noise in test output
				vi.spyOn(console, 'error').mockImplementation(() => {});

				// Set up the next FFmpeg instance to reject exec
				(
					global as unknown as { setNextMockFFmpegInstance: (inst: unknown) => void }
				).setNextMockFFmpegInstance({
					load: vi.fn().mockResolvedValue(undefined),
					writeFile: vi.fn().mockResolvedValue(undefined),
					exec: vi.fn().mockRejectedValueOnce(new Error('FFmpeg processing failed')),
					readFile: vi.fn().mockResolvedValue(new Blob(['mock-mp4-data'])),
				});

				const { result } = renderScreenRecordingHook();
				const mockBlob = createMockBlob();

				await startRecording(result);
				await completeRecordingFlow(result, mockBlob);

				expectVideoProcessingError(result);
				expect(console.error).toHaveBeenCalled();
			},
			TEST_CONSTANTS.PROCESSING_TIMEOUT
		);

		test(
			'Handles FileReader errors gracefully',
			async () => {
				const { result } = renderScreenRecordingHook();
				const mockBlob = createMockBlob();

				await startRecording(result);
				await simulateFileReaderErrorFlow(result, mockBlob);

				expectVideoProcessingError(result);
			},
			TEST_CONSTANTS.PROCESSING_TIMEOUT
		);
	});

	describe('Cleanup', () => {
		test('Cleans up timeouts on unmount', async () => {
			const { result, unmount } = renderHook(() =>
				useScreenRecording({
					videoLength: initialOptions.videoLength,
					transitionDuration: initialOptions.transitionDuration,
					videoDelay: initialOptions.videoDelay,
					setHideWidget: mockSetHideWidget,
					setHideUI: mockSetHideUI,
				})
			);

			await startRecording(result);

			// Unmount the hook
			unmount();

			// Verify all timers are cleaned up
			expect(vi.getTimerCount()).toBe(0);
		});
	});
});
