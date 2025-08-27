import { OptionsProps } from '@/lib/definitions';
import { initialOptions, transitions } from '@/lib/defaults';

export default function TransitionFunction(props: OptionsProps) {
	return (
		<>
			<select
				data-testid="transitionFunction"
				onChange={(event) => {
					const value = event.target.value;
					props.dispatch({
						type: 'changed',
						id: 'transitionFunction',
						value: value,
					});
					return;
				}}
				defaultValue={initialOptions.transitionFunction}
			>
				{transitions.map((transition) => (
					<option value={transition.value} key={transition.value}>
						{transition.label}
					</option>
				))}
			</select>
		</>
	);
}
