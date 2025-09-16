/**
 * Shadow DOM helper functions for managing the baseline-status web component
 */

export type BaselineStatusElement = HTMLElement & {
	_detailsToggleHandler?: () => void;
};

export type ShadowDOMOptions = {
	showFeatureDescription: boolean;
	featureDescription: string;
};

export type DispatchAction = (action: {
	type: 'changed';
	id: string;
	value: boolean;
}) => void;

/**
 * Sets up custom styling and elements within the
 * baseline-status web component's shadow DOM. This allows
 * us to override the component's default appearance and add
 * custom elements without modifying the original web
 * component code.
 */
export const setupShadowElements = (
	shadowRoot: ShadowRoot,
	details: HTMLDetailsElement | null
): void => {
	// Avoid duplicate setup if already initialized
	if (shadowRoot.querySelector('#feature-style')) return;

	// Inject custom CSS to web component's shadow DOM
	const style = document.createElement('style');
	style.id = 'feature-style';
	style.innerHTML = `
		.open-icon, p a[target="_top"] { display: none !important; }
		#feature-description { white-space: pre-line; }
	`;
	shadowRoot.appendChild(style);

	// Create a custom paragraph element for feature description
	const featureDescription = document.createElement('p');
	featureDescription.id = 'feature-description';
	details?.appendChild(featureDescription);
};

/**
 * Toggles visibility between the original feature
 * description and custom one. When a custom description
 * is provided, we hide the original and show ours.
 *
 */
export const updateFeatureDescription = (
	originalDescription: HTMLParagraphElement,
	featureDescription: HTMLParagraphElement,
	options: { featureDescription: string }
): void => {
	const hasCustomDescription = Boolean(options.featureDescription);

	// Toggle visibility based on custom description
	originalDescription.toggleAttribute('hidden', hasCustomDescription);
	featureDescription.toggleAttribute('hidden', !hasCustomDescription);

	// Set the custom description content
	featureDescription.innerHTML = options.featureDescription;
};

/**
 * Cleans up event listeners from a baseline status element to prevent memory leaks
 */
export const cleanupEventListeners = (element: BaselineStatusElement | null): void => {
	if (element?._detailsToggleHandler) {
		const details = element.shadowRoot?.querySelector('details');
		const handler = element._detailsToggleHandler;

		if (handler) {
			details?.removeEventListener('toggle', handler);
		}
	}
};
