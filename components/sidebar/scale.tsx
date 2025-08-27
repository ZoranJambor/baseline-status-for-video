import { VStack } from '@chakra-ui/react';
import { Slider } from '@/components/ui/slider';
import { OptionsProps } from '@/lib/definitions';
import { initialOptions } from '@/lib/defaults';

export default function Scale(props: OptionsProps) {
	const { options } = props;

	return (
		<VStack align="flex-start">
			<Slider
				mt={5}
				label={`Size: ${options.scale}`}
				defaultValue={[options.scale]}
				width="full"
				marks={[initialOptions.scale]}
				max={3}
				min={0.75}
				step={0.05}
				onValueChangeEnd={(result: { value: number[] }) => {
					props.dispatch({ type: 'changed', id: 'scale', value: result.value[0] });
					return;
				}}
				name="scale"
				data-testid="scale"
			/>
		</VStack>
	);
}
