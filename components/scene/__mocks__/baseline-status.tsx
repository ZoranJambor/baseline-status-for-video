'use client';

import * as React from 'react';

type BaselineStatusComponentProps = {
	style: React.CSSProperties;
	className: string;
	featureId: string;
};

const BaselineStatusComponentMock = vi.fn((props: BaselineStatusComponentProps) => {
	// @ts-expect-error This is the result of baseline-status web component
	return <baseline-status data-testid="BaselineStatusComponent" {...props} />;
});

export { BaselineStatusComponentMock };
