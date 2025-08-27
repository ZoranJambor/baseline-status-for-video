/*
 * useScreenRecording.helpers.ts
 *
 * Helper functions and utilities for useScreenRecording tests.
 * This file contains all reusable functions for test operations.
 */

import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useScreenRecording } from '../useScreenRecording';
import { initialOptions } from '@/lib/defaults';
import { mockMediaRecorderInstance, mockStream } from '../__mocks__/mediaRecorder';
import {
	TEST_CONSTANTS,
	lastFileReaderInstance,
	mockSetHideWidget,
	mockSetHideUI,
} from './useScreenRecording.setup';

// =====================
// Type Definitions
// =====================
export type HookResult = ReturnType<typeof renderScreenRecordingHook>['result'];

// =====================
// Creation Helpers
// =====================

/**
 * Creates a mock Blob for testing video data
 * @param data - The data content of the blob
 * @param type - The MIME type (defaults to video/webm)
 */
export function createMockBlob(data = 'mock-data', type = 'video/webm') {
	return new Blob([data], { type });
}

/**
 * Creates a mock video track with event listener support
 * This allows us to simulate screen share ending events
 */
export function createMockVideoTrack() {
	let endedListener: (() => void) | null = null;
	return {
		stop: vi.fn(),
		addEventListener: vi.fn((event, listener) => {
			if (event === 'ended') {
				endedListener = listener as () => void;
			}
		}),
		removeEventListener: vi.fn(),
		enabled: true,
		id: 'mock-video-track',
		kind: 'video',
		label: 'Mock Video Track',
		muted: false,
		readyState: 'live',
		get endedListener() {
			return endedListener;
		},
	};
}

/**
 * Renders the useScreenRecording hook with default or custom options
 * @param overrides - Optional overrides for the hook parameters
 */
export function renderScreenRecordingHook(overrides = {}) {
	return renderHook(() =>
		useScreenRecording({
			videoLength: initialOptions.videoLength,
			transitionDuration: initialOptions.transitionDuration,
			videoDelay: initialOptions.videoDelay,
			setHideWidget: mockSetHideWidget,
			setHideUI: mockSetHideUI,
			...overrides,
		})
	);
}

// =====================
// Timer Control Helpers
// =====================

/**
 * Advances timers by a specified amount and wraps in act()
 * Used to simulate time passing during async operations
 */
export async function fastForward(ms: number) {
	await act(async () => {
		vi.advanceTimersByTime(ms);
	});
}

/**
 * Runs all pending timers and wraps in act()
 * Used to complete all scheduled operations
 */
export async function runTimers() {
	await act(async () => {
		vi.runAllTimers();
	});
}

// =====================
// Mock Configuration Helpers
// =====================

/**
 * Configures the mock stream with a specific video track
 * Used when testing screen share ending scenarios
 */
export function setupMockStreamWithTrack(
	mockVideoTrack: ReturnType<typeof createMockVideoTrack>
) {
	Object.defineProperty(global.navigator, 'mediaDevices', {
		value: {
			getDisplayMedia: vi.fn().mockResolvedValue({
				...mockStream,
				getVideoTracks: () => [mockVideoTrack],
			}),
		},
		writable: true,
	});
}

// =====================
// Event Triggering Helpers
// =====================

/**
 * Triggers the MediaRecorder ondataavailable event
 * Simulates video data being available during recording
 */
export function triggerDataAvailable(blob: Blob) {
	if (mockMediaRecorderInstance.ondataavailable) {
		mockMediaRecorderInstance.ondataavailable({ data: blob });
	}
}

/**
 * Triggers a FileReader error event
 * Used to test error handling during video processing
 */
export function triggerFileReaderError(error = new Error('FileReader error')) {
	if (lastFileReaderInstance && lastFileReaderInstance.onerror) {
		lastFileReaderInstance.onerror({
			target: { error },
		} as ProgressEvent<FileReader>);
	}
}

/**
 * Triggers a FileReader load event with the result
 * Simulates successful file reading during video processing
 */
export function triggerFileReaderLoad(result = TEST_CONSTANTS.MOCK_DATA_URL) {
	if (lastFileReaderInstance && lastFileReaderInstance.onload) {
		lastFileReaderInstance.onload.call(lastFileReaderInstance, {
			target: { result },
		} as ProgressEvent<FileReader>);
	}
}

/**
 * Triggers the MediaRecorder onstop event
 * Simulates recording completion
 */
export function triggerStop(mimeType = 'video/webm') {
	if (mockMediaRecorderInstance.onstop) {
		mockMediaRecorderInstance.onstop({ target: { mimeType } });
	}
}

// =====================
// Assertion Helpers
// =====================

/**
 * Asserts that the hook is in its initial state
 * Used to verify proper initialization
 */
export function expectInitialState(result: HookResult) {
	expect(result.current.status).toBe('inactive');
	expect(result.current.videoUrl).toBe('');
	expect(result.current.videoProcessing).toBe(false);
	expect(result.current.stream).toBeNull();
}

/**
 * Asserts that recording has been properly stopped
 * Verifies that MediaRecorder.stop() and track.stop() were called
 */
export function expectRecordingStopped() {
	expect(mockMediaRecorderInstance.stop).toHaveBeenCalled();
	mockStream.getTracks().forEach((track) => {
		expect(track.stop).toHaveBeenCalled();
	});
}

/**
 * Asserts that UI elements are visible
 * Verifies that hideWidget and hideUI were set to false
 */
export function expectUIVisible() {
	expect(mockSetHideWidget).toHaveBeenLastCalledWith(false);
	expect(mockSetHideUI).toHaveBeenLastCalledWith(false);
}

/**
 * Asserts that video processing completed successfully
 * Verifies the final state after successful video processing
 */
export function expectVideoProcessingComplete(result: HookResult) {
	expect(result.current.videoProcessing).toBe(false);
	expect(result.current.status).toBe('finished');
	expect(result.current.videoUrl).toBe(TEST_CONSTANTS.MOCK_URL);
}

/**
 * Asserts that video processing failed
 * Verifies the error state after processing failure
 */
export function expectVideoProcessingError(result: HookResult) {
	expect(result.current.videoProcessing).toBe(false);
	expect(result.current.status).toBe('error');
}

// =====================
// Test Scenario Helpers
// =====================

/**
 * Completes the full recording flow from start to finish
 * This is a common pattern used across multiple tests
 */
export async function completeRecordingFlow(result: HookResult, mockBlob: Blob) {
	// Wait for recording duration + transition + buffer
	await fastForward(
		(initialOptions.videoLength + initialOptions.transitionDuration + 1) * 1000
	);
	// Wait for video delay
	await fastForward(initialOptions.videoDelay * 1000);

	// Trigger data available event
	await act(async () => {
		triggerDataAvailable(mockBlob);
	});
	await runTimers();

	// Trigger stop event
	await act(async () => {
		triggerStop();
	});
	await runTimers();

	// Trigger file reader load event
	await act(async () => {
		triggerFileReaderLoad();
	});
	await runTimers();
}

/**
 * Simulates a FileReader error during video processing
 * Used to test error handling scenarios
 */
export async function simulateFileReaderErrorFlow(result: HookResult, mockBlob: Blob) {
	// Wait for recording to complete
	await fastForward(
		(initialOptions.videoLength + initialOptions.transitionDuration + 1) * 1000
	);
	await fastForward(initialOptions.videoDelay * 1000);

	// Trigger data available and stop events
	await act(async () => {
		triggerDataAvailable(mockBlob);
	});
	await act(async () => {
		triggerStop();
	});
	await runTimers();

	// Trigger FileReader error instead of success
	await act(async () => {
		triggerFileReaderError();
	});
}

/**
 * Simulates the user ending screen share
 * Triggers the video track 'ended' event
 */
export async function simulateScreenShareEnd(
	mockVideoTrack: ReturnType<typeof createMockVideoTrack>
) {
	await act(async () => {
		if (mockVideoTrack.endedListener) mockVideoTrack.endedListener();
	});
}

/**
 * Starts recording and waits for the initial delay
 * Common setup for recording tests
 */
export async function startRecording(result: HookResult) {
	await act(async () => {
		result.current.startRecording();
		vi.advanceTimersByTime(TEST_CONSTANTS.RECORDING_START_DELAY);
	});
}

/**
 * Stops recording immediately
 * Used for testing manual stop scenarios
 */
export async function stopRecording(result: HookResult) {
	await act(async () => {
		result.current.stopRecording();
	});
}
