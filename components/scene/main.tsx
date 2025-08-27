'use client';

// React / Next
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

// Chakra UI / Icons
import { Box, Heading, IconButton } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { TbArrowsMaximize } from 'react-icons/tb';

// Lib
import { OptionsProps } from '@/lib/definitions';

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
	const { options } = props;
	const hideUI = props.hideUI ? mainStyles.hideui : '';
	const hideWidget = props.hideWidget ? baselineStyles.hidewidget : '';
	const colorScheme = baselineStyles[options.colorScheme];

	const baselineStatusRef = useCallback((node: HTMLElement | null): void => {
		if (node !== null) {
			const style = document.createElement('style');

			// Hide UI elements (arrow & learn more links) as they won't be visible in video
			style.innerHTML = '.open-icon, p a[target="_top"] { display: none !important; } ';
			node.shadowRoot?.appendChild(style);
		}
	}, []);

	return (
		<Box className={`${pageStyles.page}`}>
			<Box className={`${pageStyles.container} ${mainStyles.scene} ${hideUI}`}>
				<header className={mainStyles.header}>
					<Heading className={mainStyles.title} as="h2">
						Preview
					</Heading>
					{!props.hideUI && (
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
									if (props.setHideUI) {
										props.setHideUI((prevState: boolean) => !prevState);
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
					className={`${mainStyles.content} ${hideUI}`}
					bgColor={options.color.code}
					// transition="backgrounds"
					// transitionTimingFunction="ease-in-out"
					// transitionDuration="slow"
					data-bg-color={options.color.name}
					data-testid="sceneContainer"
					onClick={() => props.setHideUI && props.setHideUI(false)}
				>
					<BaselineStatusComponent
						style={
							{
								'--scale': options.scale,
								'--margin-block': options.marginBlock + 'rem',
								'--margin-inline': options.marginInline + 'rem',
								'--transition-function': options.transitionFunction,
								'--transition-duration': options.transitionDuration + 's',
							} as React.CSSProperties
						}
						className={`${baselineStyles.webcomponent} ${baselineStyles[options.position]} ${hideWidget} ${colorScheme}`}
						// @ts-expect-error This works as the baseline-status
						// takes featureId parameter, so I'm ignoring it for now
						// as I can't figure out how to extend the type from lit
						// component
						featureId={options.featureId}
						ref={baselineStatusRef}
						data-testid="BaselineStatusComponent"
					/>
				</Box>
				<RecordingBar
					options={options}
					dispatch={props.dispatch}
					setHideUI={props.setHideUI}
					hideUI={props.hideUI}
					hideWidget={props.hideWidget}
					setHideWidget={props.setHideWidget}
				/>
			</Box>
		</Box>
	);
}
