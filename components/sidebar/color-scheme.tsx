import { HStack, Icon, RadioCard } from '@chakra-ui/react';
import { TbSunFilled, TbMoonFilled } from 'react-icons/tb';
import { OptionsProps } from '@/lib/definitions';

export default function ColorScheme(props: OptionsProps) {
	// const { options } = props;

	return (
		<RadioCard.Root
			orientation="horizontal"
			align="center"
			justify="center"
			maxW="lg"
			defaultValue={props.options.colorScheme}
			mt={5}
			size="sm"
			onChange={(event: React.SyntheticEvent) => {
				const target = event.target as HTMLInputElement;
				props.dispatch({ type: 'changed', id: 'colorScheme', value: target.value });
			}}
		>
			<RadioCard.Label>Color Scheme</RadioCard.Label>
			<HStack align="stretch">
				<RadioCard.Item value={'light'} data-testid="colorSchemeLight">
					<RadioCard.ItemHiddenInput />
					<RadioCard.ItemControl>
						<Icon fontSize="xl">
							<TbSunFilled />
						</Icon>
						<RadioCard.ItemText>Light</RadioCard.ItemText>
					</RadioCard.ItemControl>
				</RadioCard.Item>
				<RadioCard.Item value={'dark'} data-testid="colorSchemeDark">
					<RadioCard.ItemHiddenInput />
					<RadioCard.ItemControl>
						<Icon fontSize="xl">
							<TbMoonFilled />
						</Icon>
						<RadioCard.ItemText>Dark</RadioCard.ItemText>
					</RadioCard.ItemControl>
				</RadioCard.Item>
			</HStack>
		</RadioCard.Root>
	);
}
