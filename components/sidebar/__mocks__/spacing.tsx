import { VStack } from '@chakra-ui/react';
import { OptionsProps } from '@/lib/definitions';

export default function Spacing(props: OptionsProps) {
	const { options } = props;

	return (
		<VStack align="flex-start">
			<input
				defaultValue={[options.marginBlock.toString()]}
				width="full"
				max={50}
				min={0}
				step={0.5}
				onChange={(e) => {
					props.dispatch({
						type: 'changed',
						id: 'marginBlock',
						value: e.target.value,
					});
					return;
				}}
				name="marginBlock"
				data-testid="marginBlock"
			/>
			{options.position === 'bottom-left' || options.position === 'bottom-right' ? (
				<input
					defaultValue={[options.marginInline.toString()]}
					width="full"
					max={50}
					min={0}
					step={0.5}
					onChange={(e) => {
						props.dispatch({
							type: 'changed',
							id: 'marginInline',
							value: e.target.value,
						});
						return;
					}}
					name="marginInline"
					data-testid="marginInline"
				/>
			) : null}
		</VStack>
	);
}
