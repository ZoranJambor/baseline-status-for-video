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
			<Field.Label>Feature Id</Field.Label>
			<Field.ErrorText>The featureId is required</Field.ErrorText>
			<Input
				variant="subtle"
				borderWidth={1}
				borderColor={'purple.700'}
				rounded={'lg'}
				name="featureId"
				data-testid="featureId"
				defaultValue={options.featureId}
			/>
			<Field.HelperText color={'purple.300'}>
				List of IDs:{' '}
				<Link
					href="https://github.com/web-platform-dx/web-features/tree/main/features"
					target="_blank"
					textDecoration={'underline'}
				>
					web-features repository
				</Link>
				.
			</Field.HelperText>
		</Field.Root>
	);
}
