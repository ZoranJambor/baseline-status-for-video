import { Options, Action } from '@/lib/definitions';

/**
 * Reducer function for managing application options state.
 * Follows the standard Redux reducer pattern for predictable state updates.
 *
 * @param options - Current state object containing all application options
 * @param action - Action object describing the state change
 *
 * @return New state object with the applied changes
 */
export default function optionsReducer(options: Options, action: Action) {
	switch (action.type) {
		case 'changed': {
			// Prevent setting empty featureId to avoid breaking the baseline-status component
			// This edge case is tested in the 'Feature Id' test suite
			/* v8 ignore next 3 — this is tested in 'Feature Id' test  */
			if (action.id === 'featureId' && action.value === '') {
				return options; // Return unchanged state
			}

			// Update the specific option with the new value
			return {
				...options,
				[action.id]: action.value,
			};
		}
		// This default case should never be reached
		/* v8 ignore next 3 */
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
