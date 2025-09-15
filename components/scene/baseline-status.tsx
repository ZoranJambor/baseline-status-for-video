'use client';

// @ts-expect-error There is no declaration in baseline-status component
import { BaselineStatus } from 'baseline-status';
import * as React from 'react';
import { createComponent } from '@lit/react';

/**
 * React wrapper for the baseline-status Lit web component.
 * This component displays browser feature support information from MDN's baseline data.
 *
 * The createComponent function from @lit/react bridges the gap between Lit web components
 * and React, allowing us to use the baseline-status component as a regular React component.
 */
export const BaselineStatusComponent = createComponent({
	tagName: 'baseline-status',
	elementClass: BaselineStatus,
	react: React,
	displayName: 'BaselineStatusComponent',
});

/**
 * TypeScript limitation note:
 * The createComponent function infers the elementClass type as HTMLElement instead of
 * the actual LitWebComponent class. This means we lose access to custom properties
 * like the featureId prop that the baseline-status component accepts.
 *
 * This is a known limitation with @lit/react integration:
 * https://stackoverflow.com/questions/77847783/add-properties-to-lit-react-wrapper-using-lit-react
 *
 * We work around this by using @ts-expect-error comments where we pass the featureId prop.
 */
