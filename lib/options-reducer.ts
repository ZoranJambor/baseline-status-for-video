import { Options, Action } from '@/lib/definitions';

export default function optionsReducer(options: Options, action: Action) {
	switch (action.type) {
		case 'changed': {
			/* v8 ignore next 3 — this is tested in 'Feature Id' test  */
			if (action.id === 'featureId' && action.value === '') {
				return options;
			}
			return {
				...options,
				[action.id]: action.value,
			};
		}
		/* v8 ignore next 3 */
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
