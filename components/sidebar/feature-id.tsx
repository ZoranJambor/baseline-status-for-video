import { Input, Field, Link } from '@chakra-ui/react';
import { useDebouncedCallback } from 'use-debounce';
import { OptionsProps } from '@/lib/definitions';

export default function FeatureId(props: OptionsProps) {
	const { options } = props;

	// Don't rerender on every key stroke
	const changeFeatureId = useDebouncedCallback((value: string): void => {
		props.dispatch({
			type: 'changed',
			id: 'featureId',
			value: value.trim(),
		});
	}, 500);

	return (
		<Field.Root
			mt={5}
			required
			onChange={(event: React.SyntheticEvent) => {
				const target = event.target as HTMLInputElement;
				return changeFeatureId(target.value);
			}}
		>
			<Field.Label>
				Feature Id
				{/* <Field.HelperText> */}
				<small style={{ display: 'none' }}>
					(You can find the list of ids in{' '}
					<Link
						href="https://github.com/web-platform-dx/web-features/tree/main/features"
						target="_blank"
					>
						web-features repository)
					</Link>
				</small>
				{/* </Field.HelperText> */}
			</Field.Label>
			<Field.ErrorText>The featureId is required</Field.ErrorText>
			<Input
				variant="subtle"
				borderWidth={1}
				borderColor={'purple.700'}
				rounded={'lg'}
				name="featureId"
				data-testid="featureId"
				// placeholder="featureId"
				defaultValue={options.featureId}
			/>
		</Field.Root>
	);
}
