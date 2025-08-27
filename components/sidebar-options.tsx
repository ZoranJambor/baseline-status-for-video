'use client';

// React
import { Box, Heading } from '@chakra-ui/react';

// Lib
import { OptionsProps } from '@/lib/definitions';

// Scene Components
import FeatureId from '@/components/sidebar/feature-id';
import BackgroundColor from '@/components/sidebar/background-color';
import Position from '@/components/sidebar/position';
import Scale from '@/components/sidebar/scale';
import Spacing from '@/components/sidebar/spacing';
import TransitionDuration from '@/components/sidebar/transition-duration';
import TransitionFunction from '@/components/sidebar/transition-function';
import ColorScheme from '@/components/sidebar/color-scheme';

// Styles
import pageStyles from '@/app/page.module.css';
import styles from '@/components/sidebar-options.module.css';

export default function SidebarOptions(props: OptionsProps) {
	const { options } = props;

	return (
		<Box className={`${pageStyles.container} ${styles.sidebar}`}>
			<Heading as="h2">Options</Heading>

			<FeatureId options={options} dispatch={props.dispatch} />
			<BackgroundColor options={options} dispatch={props.dispatch} />
			<Position options={options} dispatch={props.dispatch} />
			<Scale options={options} dispatch={props.dispatch} />
			<Spacing options={options} dispatch={props.dispatch} />
			<TransitionDuration options={options} dispatch={props.dispatch} />
			<TransitionFunction
				options={options}
				dispatch={props.dispatch}
				setHideWidget={props.setHideWidget}
			/>
			<ColorScheme options={options} dispatch={props.dispatch} />
		</Box>
	);
}
