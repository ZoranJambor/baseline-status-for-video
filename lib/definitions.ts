export type Swatch = {
	name: string;
	code: string;
};

export type Swatches = Swatch[];

export type Options = {
	featureId: string;
	color: Swatch;
	position: string;
	scale: number;
	videoLength: number;
	videoDelay: number;
	marginBlock: number;
	marginInline: number;
	transitionDuration: number;
	transitionFunction: string;
	colorScheme: 'light' | 'dark';
	showFeatureDescription: boolean;
	featureDescription: string;
};

export type DispatchAction = {
	(action: Action): void;
};

export type OptionsProps = {
	options: Options;
	dispatch: DispatchAction;
	hideUI?: boolean;
	setHideUI?: (value: boolean | ((prevState: boolean) => boolean)) => void;
	hideWidget?: boolean;
	setHideWidget?: (value: boolean | ((prevState: boolean) => boolean)) => void;
};

export type Action = {
	id: string;
	type: 'changed';
	value: string | number | Swatch | boolean;
};
