/*
 * useScreenRecording.setup.ts
 *
 * Test setup and configuration for useScreenRecording tests.
 * This file handles all mock setup, constants, and shared configuration.
 */

import { vi } from 'vitest';
import { initialOptions } from '@/lib/defaults';
import { MockFileReader } from '../__mocks__/fileReader';
import {
	mockMediaRecorderInstance,
	MockMediaRecorder,
	mockStream,
} from '../__mocks__/mediaRecorder';

// =====================
// Test Constants
// =====================
export const TEST_CONSTANTS = {
	DELAY: (initialOptions.transitionDuration + 1) * 1000,
	VIDEO_LENGTH: initialOptions.videoLength,
	RECORDING_START_DELAY: 2000,
	MOCK_DATA_URL: 'mock-data-url',
	MOCK_URL: 'mock-url',
	RECORDING_TIMEOUT: 10000,
	PROCESSING_TIMEOUT: 30000,
} as const;

// =====================
// Mock FileReader Setup
// =====================
export let lastFileReaderInstance: MockFileReader | null = null;

export function createMockFileReaderWithTracking() {
	const mockReader = new MockFileReader();
	lastFileReaderInstance = mockReader;
	return mockReader;
}

// Replace global FileReader with our tracked mock
global.FileReader = createMockFileReaderWithTracking as unknown as typeof FileReader;

// =====================
// Mock MediaRecorder Setup
// =====================
(mockMediaRecorderInstance as unknown as MediaRecorder).start = vi.fn(() => {
	mockMediaRecorderInstance.state = 'recording';
});

(MockMediaRecorder as unknown as typeof MediaRecorder).isTypeSupported = vi
	.fn()
	.mockReturnValue(true);
global.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder;

// =====================
// Mock Browser APIs
// =====================
Object.defineProperty(global.navigator, 'mediaDevices', {
	value: {
		getDisplayMedia: vi.fn().mockResolvedValue(mockStream),
	},
	writable: true,
});

global.URL.createObjectURL = vi.fn().mockReturnValue(TEST_CONSTANTS.MOCK_URL);

// =====================
// Mock UI State Functions
// =====================
export const mockSetHideWidget = vi.fn();
export const mockSetHideUI = vi.fn();
