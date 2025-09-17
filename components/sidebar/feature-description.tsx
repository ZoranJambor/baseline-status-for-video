import DOMPurify from 'dompurify';
import { useDebouncedCallback } from 'use-debounce';
import { Textarea, Field, Switch, HStack } from '@chakra-ui/react';
import { OptionsProps } from '@/lib/definitions';

export default function FeatureDescription(props: OptionsProps) {
	const { options } = props;

	const handleDescriptionChange = useDebouncedCallback((event: React.SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		let value = target.value.trim();

		// Sanitize HTML
		if (value) {
			value = DOMPurify.sanitize(value, { FORCE_BODY: true });
		}

		props.dispatch({
			type: 'changed',
			id: 'featureDescription',
			value: value,
		});
	}, 200);

	return (
		<Field.Root mt={5} required>
			<HStack justify="space-between" w="100%">
				<Field.Label>Feature Description</Field.Label>
				<Switch.Root
					size="sm"
					gap={0}
					checked={options.showFeatureDescription}
					data-testid="showFeatureDescriptionSwitch"
					onCheckedChange={(e) => {
						props.dispatch({
							type: 'changed',
							id: 'showFeatureDescription',
							value: e.checked,
						});
					}}
				>
					<Switch.HiddenInput data-testid="showFeatureDescription" />
					<Switch.Control />
					<Switch.Label />
				</Switch.Root>
			</HStack>
			<Textarea
				mt={1}
				hidden={!options.showFeatureDescription}
				variant="subtle"
				borderWidth={1}
				autoresize
				borderColor={'purple.700'}
				rounded={'lg'}
				name="featureDescription"
				data-testid="featureDescription"
				onChange={handleDescriptionChange}
				defaultValue={options.featureDescription}
			/>
			<Field.HelperText
				mt={1}
				hidden={!options.showFeatureDescription}
				color={'purple.300'}
			>
				HTML is allowed. The default Baseline feature description will be displayed if you
				leave the field empty.
			</Field.HelperText>
		</Field.Root>
	);
}
