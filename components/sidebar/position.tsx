import { HStack, Icon } from '@chakra-ui/react';
import { RadioCardItem, RadioCardLabel, RadioCardRoot } from '@/components/ui/radio-card';
import {
	TbBoxAlignBottomFilled,
	TbBoxAlignTopFilled,
	TbBoxAlignBottomLeftFilled,
	TbBoxAlignBottomRightFilled,
} from 'react-icons/tb';

import { OptionsProps } from '@/lib/definitions';

export const positions = [
	{ value: 'bottom', title: 'Bottom', icon: <TbBoxAlignBottomFilled /> },
	{ value: 'top', title: 'Top', icon: <TbBoxAlignTopFilled /> },
	{ value: 'bottom-left', title: 'Bottom Left', icon: <TbBoxAlignBottomLeftFilled /> },
	{
		value: 'bottom-right',
		title: 'Bottom Right',
		icon: <TbBoxAlignBottomRightFilled />,
	},
];

export default function Position(props: OptionsProps) {
	const { options } = props;

	return (
		<RadioCardRoot
			orientation="horizontal"
			align="center"
			justify="center"
			maxW="lg"
			defaultValue={options.position}
			mt={5}
			size="sm"
			name="position"
			onChange={(event: React.SyntheticEvent) => {
				const target = event.target as HTMLInputElement;
				props.dispatch({ type: 'changed', id: 'position', value: target.value });
			}}
		>
			<RadioCardLabel>Position</RadioCardLabel>
			<HStack align="stretch">
				{positions.map((item) => (
					<RadioCardItem
						_checked={{ color: 'purple.400' }}
						aria-label={item.title}
						title={item.title}
						icon={<Icon fontSize="2xl">{item.icon}</Icon>}
						indicator={false}
						key={item.value}
						value={item.value}
						data-testid={`position-${item.value}`}
					/>
				))}
			</HStack>
		</RadioCardRoot>
	);
}
