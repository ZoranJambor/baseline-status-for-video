'use client';

import * as React from 'react';

type BaselineStatusComponentProps = {
	style: React.CSSProperties;
	className: string;
	featureId: string;
};

// export function BaselineStatusComponent(props: BaselineStatusComponentProps) {
// 	// console.log('myprops', props);
// 	return (
// 		// @ts-expect-error This is the result of baseline-status web component
// 		<baseline-status data-testid="BaselineStatusComponent" {...props} />
// 	);
// }

const BaselineStatusComponentMock = vi.fn((props: BaselineStatusComponentProps) => {
	// console.log('baseline__mock props', props);
	// @ts-expect-error This is the result of baseline-status web component
	return <baseline-status data-testid="BaselineStatusComponent" {...props} />;
});

export { BaselineStatusComponentMock };
