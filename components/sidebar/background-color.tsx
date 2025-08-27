import { parseColor } from '@chakra-ui/react';
import {
	ColorPickerLabel,
	ColorPickerRoot,
	ColorPickerSwatchGroup,
	ColorPickerSwatchTrigger,
} from '@/components/ui/color-picker';

// Lib
import { OptionsProps } from '@/lib/definitions';
import { swatches } from '@/lib/defaults';

// Styles
import styles from '@/components/sidebar/background-color.module.css';

// Typescript doesn't support CSS variables by default
import React, { CSSProperties } from 'react';
export type CustomCSS = CSSProperties & {
	'--outline': string;
};

export default function BackgroundColor(props: OptionsProps) {
	const { options } = props;

	return (
		<ColorPickerRoot
			defaultValue={parseColor(options.color.code)}
			onChange={(event: React.SyntheticEvent) => {
				const target = event.target as HTMLInputElement;
				const newColor = swatches.find((item) => target.value === item.code);
				if (newColor) props.dispatch({ type: 'changed', id: 'color', value: newColor });
			}}
			name="color"
			alignItems="flex-start"
			format="hsla"
			mt={5}
		>
			<ColorPickerLabel color={'inherit'}>Video Background Color</ColorPickerLabel>
			<ColorPickerSwatchGroup className={styles.picker}>
				{swatches.map((item) => (
					<ColorPickerSwatchTrigger
						className={styles.swatch}
						key={item.name}
						value={item.code}
						data-testid={item.name}
						id={item.name}
						style={
							{
								'--outline': item.outline,
							} as CustomCSS
						}
					/>
				))}
			</ColorPickerSwatchGroup>
		</ColorPickerRoot>
	);
}
