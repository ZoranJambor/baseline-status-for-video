/**
 * usePersistedState.test.ts
 *
 * Test suite for the usePersistedState hook.
 *
 * This test suite covers:
 * - Initial state loading from localStorage
 * - State persistence to localStorage
 * - Error handling for localStorage failures
 * - State merging with default values
 * - Loading state management
 */

import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { usePersistedState } from '../usePersistedState';
import { initialOptions } from '@/lib/defaults';
import type { Action } from '@/lib/definitions';

// Mock console.warn to test error handling without cluttering test output
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('Persisted State Hook (localStorage)', () => {
	// Use the existing localStorage mock from setup-test.ts
	let mockLocalStorage: {
		getItem: ReturnType<typeof vi.fn>;
		setItem: ReturnType<typeof vi.fn>;
		removeItem: ReturnType<typeof vi.fn>;
		clear: ReturnType<typeof vi.fn>;
		length: number;
		key: (index: number) => string | null;
	};

	beforeEach(() => {
		// Reset all mocks before each test
		vi.clearAllMocks();
		mockConsoleWarn.mockClear();

		// Get reference to the mocked localStorage from setup-test.ts
		mockLocalStorage = window.localStorage as typeof mockLocalStorage;

		// Reset localStorage mock methods
		mockLocalStorage.getItem.mockReset();
		mockLocalStorage.setItem.mockReset();
		mockLocalStorage.removeItem.mockReset();
		mockLocalStorage.clear.mockReset();

		// Default to returning null (empty localStorage)
		mockLocalStorage.getItem.mockReturnValue(null);

		// Also set global localStorage to the same mock for Node.js environment
		(global as typeof globalThis).localStorage = mockLocalStorage;
	});

	afterEach(() => {
		// Clean up after each test
		mockConsoleWarn.mockClear();
	});

	test('Initializes with default options when localStorage is empty', async () => {
		mockLocalStorage.getItem.mockReturnValue(null);
		const { result } = renderHook(() => usePersistedState());

		// In test environment, useEffect runs
		// synchronously, so isLoaded is immediately
		// true
		const [options, dispatch, isLoaded] = result.current;

		expect(isLoaded).toBe(true);
		expect(options).toEqual(initialOptions);
		expect(typeof dispatch).toBe('function');
		expect(mockLocalStorage.getItem).toHaveBeenCalledWith('baseline-status-options');
	});

	test('Loads and merges saved options from localStorage', async () => {
		const savedOptions = {
			featureId: 'margin',
			colorScheme: 'dark' as const,
			// Missing some properties to test merging
		};
		mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedOptions));
		const { result } = renderHook(() => usePersistedState());

		const [options, , isLoaded] = result.current;
		expect(isLoaded).toBe(true);

		// Saved values
		expect(options.featureId).toBe('margin');
		expect(options.colorScheme).toBe('dark');

		// Should still have default values for unspecified properties
		expect(options.color).toEqual(initialOptions.color);
		expect(options.position).toBe(initialOptions.position);
	});

	test('Handles invalid JSON in localStorage gracefully', async () => {
		mockLocalStorage.getItem.mockReturnValue('invalid-json{');
		const { result } = renderHook(() => usePersistedState());
		const [options, , isLoaded] = result.current;

		expect(isLoaded).toBe(true);
		expect(options).toEqual(initialOptions);
		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Failed to load saved options from localStorage:',
			expect.any(Error)
		);
	});

	test('State changes are saved to localStorage', async () => {
		mockLocalStorage.getItem.mockReturnValue(null);
		const { result } = renderHook(() => usePersistedState());

		// Clear previous calls from initialization
		mockLocalStorage.setItem.mockClear();

		// Dispatch a state change
		const newAction: Action = {
			id: 'featureId',
			type: 'changed',
			value: 'new-feature-id',
		};

		act(() => {
			result.current[1](newAction);
		});

		const [updatedOptions] = result.current;
		expect(updatedOptions.featureId).toBe('new-feature-id');
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
			'baseline-status-options',
			JSON.stringify(updatedOptions)
		);
	});

	test('Handles localStorage setItem errors gracefully', async () => {
		mockLocalStorage.getItem.mockReturnValue(null);
		mockLocalStorage.setItem.mockImplementation(() => {
			throw new Error('Storage quota exceeded');
		});
		const { result } = renderHook(() => usePersistedState());

		// Clear previous console warnings
		mockConsoleWarn.mockClear();

		// Dispatch a state change
		act(() => {
			result.current[1]({
				id: 'scale',
				type: 'changed',
				value: 1.5,
			});
		});

		// Wait for save attempt
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Failed to save options to localStorage:',
			expect.any(Error)
		);
	});

	test('Handles localStorage getItem errors gracefully', async () => {
		mockLocalStorage.getItem.mockImplementation(() => {
			throw new Error('localStorage not available');
		});

		const { result } = renderHook(() => usePersistedState());
		const [options, , isLoaded] = result.current;

		expect(options).toEqual(initialOptions);
		expect(isLoaded).toBe(true);
		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Failed to load saved options from localStorage:',
			expect.any(Error)
		);
	});
});
