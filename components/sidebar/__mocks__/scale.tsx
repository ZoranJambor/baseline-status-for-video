import { VStack } from '@chakra-ui/react';
import { OptionsProps } from '@/lib/definitions';

export default function Scale(props: OptionsProps) {
	const { options } = props;

	return (
		<VStack align="flex-start">
			<input
				type="number"
				value={[options.scale.toString()]}
				width="full"
				max={3}
				min={0.75}
				step={0.05}
				onChange={(e) => {
					props.dispatch({ type: 'changed', id: 'scale', value: e.target.value });
				}}
				name="scale"
				data-testid="scale"
			/>
		</VStack>
	);
}
