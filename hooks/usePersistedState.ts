import { useReducer, useEffect, useState } from 'react';
import { Options, Action } from '@/lib/definitions';
import { initialOptions } from '@/lib/defaults';
import optionsReducer from '@/lib/options-reducer';

const STORAGE_KEY = 'baseline-status-options';

/**
 * Custom hook for managing persisted application state.
 * Automatically saves state changes to localStorage and
 * loads saved state on mount.
 *
 * @returns [options, dispatch, isLoaded] - options state, dispatch function, and loading status
 */
export function usePersistedState(): [Options, React.Dispatch<Action>, boolean] {
	const [isLoaded, setIsLoaded] = useState(false);

	// Initialize with default options, but we'll override them after loading from localStorage
	const [options, dispatch] = useReducer(optionsReducer, initialOptions);

	// Load saved state from localStorage on mount
	useEffect(() => {
		try {
			const savedOptions = localStorage.getItem(STORAGE_KEY);
			if (!savedOptions) return;

			const parsedOptions = JSON.parse(savedOptions);
			if (!parsedOptions || typeof parsedOptions !== 'object') return;

			// Merge with defaults to handle new properties that might have been added
			const mergedOptions = { ...initialOptions, ...parsedOptions };

			// Get changed options
			const changedOptions = Object.entries(mergedOptions).filter(
				([key, value]) =>
					key in initialOptions && value !== initialOptions[key as keyof Options]
			);

			// Update state for changed options
			changedOptions.forEach(([key, value]) => {
				dispatch({
					id: key,
					type: 'changed',
					value: value,
				} as Action);
			});
		} catch (error) {
			console.warn('Failed to load saved options from localStorage:', error);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	// Save state to localStorage whenever options change (but not on initial load)
	useEffect(() => {
		if (isLoaded) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
				// localStorage.setItem(STORAGE_KEY, 's');
			} catch (error) {
				console.warn('Failed to save options to localStorage:', error);
			}
		}
	}, [options, isLoaded]);

	return [options, dispatch, isLoaded];
}
