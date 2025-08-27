import {
	VStack,
	Portal,
	Select,
	HStack,
	createListCollection,
	Button,
} from '@chakra-ui/react';
import { useState } from 'react';

import { OptionsProps } from '@/lib/definitions';
import { initialOptions, transitions } from '@/lib/defaults';
// import { TbPlayerPlayFilled } from 'react-icons/tb';
// import { TbReplaceFilled } from 'react-icons/tb';

export default function TransitionFunction(props: OptionsProps) {
	const { options } = props;
	const transitions1 = createListCollection({ items: [...transitions] });
	const setHideWidget = props.setHideWidget;
	const [previewActive, setPreviewActive] = useState(false);

	if (typeof setHideWidget === 'undefined') {
		throw Error('setHideWidget is undefined');
		return;
	}

	return (
		<>
			<VStack align="flex-start">
				<Select.Root
					variant="outline"
					collection={transitions1}
					mt={5}
					onValueChange={(result: { value: string[] }) => {
						props.dispatch({
							type: 'changed',
							id: 'transitionFunction',
							value: result.value[0],
						});
						return;
					}}
					size="md"
					defaultValue={[initialOptions.transitionFunction]}
				>
					<Select.HiddenSelect data-testid="transitionFunction" />
					<Select.Label>Transition Function</Select.Label>
					<HStack>
						<Select.Control w="150px">
							<Select.Trigger>
								<Select.ValueText placeholder="Select transition function" />
							</Select.Trigger>
							<Select.IndicatorGroup>
								<Select.Indicator />
							</Select.IndicatorGroup>
						</Select.Control>
						<Button
							disabled={previewActive ? true : false}
							size="md"
							w="90px"
							variant="outline"
							onClick={() => {
								if (typeof props.setHideWidget === 'undefined') {
									throw Error('setHideWidget is undefined');
									return;
								}
								setHideWidget((prevState) => !prevState);
								setPreviewActive(true);
								setTimeout(() => {
									setHideWidget((prevState) => !prevState);
									setPreviewActive(false);
								}, options.transitionDuration * 1000);
							}}
							data-testid="previewButton"
						>
							Preview
							{/* <TbPlayerPlayFilled /> */}
							{/* <TbReplaceFilled /> */}
						</Button>
					</HStack>
					<Portal>
						<Select.Positioner>
							<Select.Content>
								{transitions1.items.map((transition) => (
									<Select.Item item={transition} key={transition.value} width="150px">
										{transition.label}
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
					</Portal>
				</Select.Root>
			</VStack>
		</>
	);
}
