import { VStack } from '@chakra-ui/react';
import { Slider } from '@/components/ui/slider';
import { OptionsProps } from '@/lib/definitions';
import { initialOptions } from '@/lib/defaults';

export default function TransitionDuration(props: OptionsProps) {
	const { options } = props;

	return (
		<>
			<VStack align="flex-start">
				<Slider
					mt={5}
					label={`Transition Duration: ${options.transitionDuration}s`}
					defaultValue={[options.transitionDuration]}
					width="full"
					marks={[initialOptions.transitionDuration]}
					max={3}
					min={0.1}
					step={0.05}
					onValueChangeEnd={(result: { value: number[] }) => {
						props.dispatch({
							type: 'changed',
							id: 'transitionDuration',
							value: result.value[0],
						});
						return;
					}}
					name="transitionDuration"
				/>
			</VStack>
		</>
	);
}
