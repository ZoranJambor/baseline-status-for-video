import { VStack } from '@chakra-ui/react';
import { Slider } from '@/components/ui/slider';
import { OptionsProps } from '@/lib/definitions';
import { initialOptions } from '@/lib/defaults';

export default function Spacing(props: OptionsProps) {
	const { options } = props;

	return (
		<VStack align="flex-start">
			<Slider
				mt={5}
				label={`Margin Block: ${options.marginBlock}rem`}
				defaultValue={[options.marginBlock]}
				width="full"
				marks={[initialOptions.marginBlock]}
				max={50}
				min={0}
				step={0.5}
				onValueChangeEnd={(result: { value: number[] }) => {
					props.dispatch({
						type: 'changed',
						id: 'marginBlock',
						value: result.value[0],
					});
					return;
				}}
				name="marginBlock"
			/>
			{options.position === 'bottom-left' || options.position === 'bottom-right' ? (
				<Slider
					mt={5}
					label={`Margin Inline: ${options.marginInline}rem`}
					defaultValue={[options.marginInline]}
					width="full"
					marks={[initialOptions.marginInline]}
					max={50}
					min={0}
					step={0.5}
					onValueChangeEnd={(result: { value: number[] }) => {
						props.dispatch({
							type: 'changed',
							id: 'marginInline',
							value: result.value[0],
						});
						return;
					}}
					name="marginInline"
				/>
			) : null}
		</VStack>
	);
}
