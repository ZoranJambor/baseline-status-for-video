import { VStack } from '@chakra-ui/react';
import { OptionsProps } from '@/lib/definitions';

export default function TransitionDuration(props: OptionsProps) {
	const { options } = props;

	return (
		<VStack align="flex-start">
			<input
				type="number"
				value={[options.scale.toString()]}
				width="full"
				max={2}
				min={0}
				step={0.05}
				onChange={(e) => {
					props.dispatch({
						type: 'changed',
						id: 'transitionDuration',
						value: e.target.value,
					});
				}}
				name="transitionDuration"
				data-testid="transitionDuration"
			/>
		</VStack>
	);
}
