'use client';

// @ts-expect-error There is no declaration in baseline-status component
import { BaselineStatus } from 'baseline-status';
import * as React from 'react';
import { createComponent } from '@lit/react';

export const BaselineStatusComponent = createComponent({
	tagName: 'baseline-status',
	elementClass: BaselineStatus,
	react: React,
	displayName: 'BaselineStatusComponent',
});

//  createComponent is inferring the type of the provided
// elementClass to be HTMLElement, when it should be the
// class extending HTMLElement, LitWebComponent which should
// also have the text property.
// https://stackoverflow.com/questions/77847783/add-properties-to-lit-react-wrapper-using-lit-react
