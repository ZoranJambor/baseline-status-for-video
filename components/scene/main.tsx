'use client';

// React / Next
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useMemo } from 'react';

// Chakra UI / Icons
import { Box, Heading, IconButton } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { TbArrowsMaximize } from 'react-icons/tb';

// Lib
import { OptionsProps } from '@/lib/definitions';
import {
	BaselineStatusElement,
	ShadowDOMOptions,
	DispatchAction,
	setupShadowElements,
	updateFeatureDescription,
	cleanupEventListeners,
} from '@/lib/baseline-status-helpers';

/**
 * Custom hook that manages the baseline-status web component's shadow DOM manipulation.
 * This hook handles the complex task of:
 * 1. Setting up custom elements and styling within the web component's shadow DOM
 * 2. Syncing React state with the web component's internal state
 * 3. Managing event listeners for user interactions
 * 4. Properly cleaning up resources to prevent memory leaks
 */
const useBaselineStatusRef = (options: ShadowDOMOptions, dispatch: DispatchAction) => {
	const nodeRef = useRef<BaselineStatusElement | null>(null);

	const ref = useCallback(
		(node: BaselineStatusElement | null): void => {
			// Cleanup previous node's event listener to prevent memory leaks
			cleanupEventListeners(nodeRef.current);

			nodeRef.current = node;

			// Only proceed if node and shadowRoot exist (web component is ready)
			if (node !== null && node.shadowRoot) {
				const shadowRoot = node.shadowRoot;
				const details = shadowRoot.querySelector('details');
				const originalDescription = shadowRoot.querySelector(
					'summary + p'
				) as HTMLParagraphElement | null;
				const featureDescription = shadowRoot.querySelector(
					'#feature-description'
				) as HTMLParagraphElement | null;

				if (!originalDescription) {
					console.warn('Original description element not found in shadow DOM');
					return;
				}

				// Setup shadow DOM elements (custom styling and elements)
				setupShadowElements(shadowRoot, details);

				// Sync the details element's open state with our React state
				details?.toggleAttribute('open', options.showFeatureDescription);

				// Setup event listener to keep React state in sync with DOM changes
				const handleDetailsToggle = () => {
					const isOpen = details?.hasAttribute('open') ?? false;

					// Only dispatch if the state has
					// changed to avoid unnecessary
					// re-renders
					if (isOpen !== options.showFeatureDescription) {
						dispatch({
							type: 'changed',
							id: 'showFeatureDescription',
							value: isOpen,
						});
					}
				};

				// Remove any existing listener first to avoid duplicates
				details?.removeEventListener('toggle', handleDetailsToggle);
				details?.addEventListener('toggle', handleDetailsToggle);

				// Store reference for cleanup
				node._detailsToggleHandler = handleDetailsToggle;

				// Update feature description visibility based on current options
				if (featureDescription) {
					updateFeatureDescription(originalDescription, featureDescription, options);
				}
			}
		},
		[options, dispatch]
	);

	// Cleanup on unmount to prevent memory leaks
	useEffect(() => {
		return () => {
			cleanupEventListeners(nodeRef.current);
		};
	}, []);

	return ref;
};

// Scene Components
import RecordingBar from '@/components/scene/recording-bar';
import pageStyles from '@/app/page.module.css';
import mainStyles from '@/components/scene/main.module.css';
import baselineStyles from '@/components/scene/baseline-status.module.css';

// BaselineStatusComponent uses window object,
// so we're making sure ssr isn't used here
// import { BaselineStatusComponent } from '@/components/scene/baseline-status';
const BaselineStatusComponent = dynamic(
	() =>
		import('@/components/scene/baseline-status').then(
			(mod) => mod.BaselineStatusComponent
		),
	{
		ssr: false,
	}
);

export default function Main(props: Required<OptionsProps>) {
	const { options, dispatch, hideUI, hideWidget, setHideUI, setHideWidget } = props;
	const hideUIClass = hideUI ? mainStyles.hideui : '';
	const hideWidgetClass = hideWidget ? baselineStyles.hidewidget : '';
	const colorScheme = baselineStyles[options.colorScheme];

	// Memoize CSS custom properties to prevent unnecessary re-renders
	// These properties are passed to the web component and control its visual appearance
	const cssProperties = useMemo(
		() =>
			({
				'--scale': options.scale,
				'--margin-block': options.marginBlock + 'rem',
				'--margin-inline': options.marginInline + 'rem',
				'--transition-function': options.transitionFunction,
				'--transition-duration': options.transitionDuration + 's',
			}) as React.CSSProperties,
		[
			options.scale,
			options.marginBlock,
			options.marginInline,
			options.transitionFunction,
			options.transitionDuration,
		]
	);

	// Use custom hook for baseline status ref management
	const baselineStatusRef = useBaselineStatusRef(options, dispatch);

	return (
		<Box className={`${pageStyles.page}`}>
			<Box className={`${pageStyles.container} ${mainStyles.scene} ${hideUIClass}`}>
				<header className={mainStyles.header}>
					<Heading className={mainStyles.title} as="h2">
						Preview
					</Heading>
					{!hideUI && (
						<Tooltip
							openDelay={200}
							content="To exit the fullscreen (preview or recording), press the Escape key, or click the mouse button — the cursor will be invisible, but the click will still work."
						>
							<IconButton
								className={mainStyles.icon}
								aria-label="Toggle UI"
								variant="plain"
								size="sm"
								onClick={(e) => {
									if (setHideUI) {
										setHideUI((prevState: boolean) => !prevState);
									}
									e.stopPropagation();
								}}
								data-testid="toggleUi"
							>
								<TbArrowsMaximize />
							</IconButton>
						</Tooltip>
					)}
				</header>
				<Box
					className={`${mainStyles.content} ${hideUIClass}`}
					bgColor={options.color.code}
					// transition="backgrounds"
					// transitionTimingFunction="ease-in-out"
					// transitionDuration="slow"
					data-bg-color={options.color.name}
					data-testid="sceneContainer"
					onClick={() => setHideUI && setHideUI(false)}
				>
					<BaselineStatusComponent
						style={cssProperties}
						className={`${baselineStyles.webcomponent} ${baselineStyles[options.position]} ${hideWidgetClass} ${colorScheme}`}
						// @ts-expect-error Limitation of @lit/react integration
						featureId={options.featureId}
						ref={baselineStatusRef}
						data-testid="BaselineStatusComponent"
					/>
				</Box>
				<RecordingBar
					options={options}
					dispatch={dispatch}
					setHideUI={setHideUI}
					hideUI={hideUI}
					hideWidget={hideWidget}
					setHideWidget={setHideWidget}
				/>
			</Box>
		</Box>
	);
}
