/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';
import { OptionsProps } from '@/lib/definitions';

// Components
import FeatureDescription from '../feature-description';
import Home from '@/app/page';

describe('Option Feature Description', () => {
	const mockDispatch = vi.fn();

	const createMockProps = (
		overrides: Partial<OptionsProps['options']> = {}
	): OptionsProps => ({
		options: {
			...initialOptions,
			...overrides,
		},
		dispatch: mockDispatch,
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Feature Description textarea handles input changes', () => {
		const props = createMockProps();
		render(<FeatureDescription {...props} />);

		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');
		fireEvent.change(textarea, { target: { value: 'New description' } });

		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'changed',
			id: 'featureDescription',
			value: 'New description',
		});
	});

	test('Feature Description textarea trims whitespace from input', () => {
		const props = createMockProps();
		render(<FeatureDescription {...props} />);

		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');
		fireEvent.change(textarea, { target: { value: '  Trimmed description  ' } });

		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'changed',
			id: 'featureDescription',
			value: 'Trimmed description',
		});
	});

	test('Feature Description textarea sanitizes dangerous HTML elements', () => {
		const props = createMockProps();
		render(<FeatureDescription {...props} />);

		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');
		const dangerousInput =
			'<script>alert("xss")</script><iframe src="evil.com"></iframe><img src="x" onerror="alert(1)"><b>Safe</b>';

		fireEvent.change(textarea, { target: { value: dangerousInput } });

		// Test that dangerous elements are removed but safe ones remain
		// DOMPurify removes script tags, iframes, and dangerous attributes but keeps safe img and b tags
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'changed',
			id: 'featureDescription',
			value: '<img src="x"><b>Safe</b>', // Script and iframe removed, onerror attribute removed from img
		});
	});

	test('Feature Description textarea preserves <style> tags', () => {
		const props = createMockProps();
		render(<FeatureDescription {...props} />);

		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');
		const complexStyles =
			'<style>.feature { background: linear-gradient(45deg, #ff0000, #00ff00); animation: spin 2s linear infinite; }</style><div class="feature">Complex styling</div>';

		fireEvent.change(textarea, { target: { value: complexStyles } });

		// Test that complex CSS in style tags is preserved
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'changed',
			id: 'featureDescription',
			value:
				'<style>.feature { background: linear-gradient(45deg, #ff0000, #00ff00); animation: spin 2s linear infinite; }</style><div class="feature">Complex styling</div>',
		});
	});

	test('Feature Description textarea handles partial HTML tags after sanitization', () => {
		const props = createMockProps();
		render(<FeatureDescription {...props} />);

		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');
		fireEvent.change(textarea, { target: { value: ' <s  ' } });

		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'changed',
			id: 'featureDescription',
			value: '',
		});
	});
});

describe('Feature Description Integration Tests', () => {
	beforeEach(async () => {
		await waitFor(() => {
			render(<Home />);
		});

		// Wait for the persisted state to load
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
	});

	test('Feature Description switch and textarea are rendered', async () => {
		const descriptionSwitch = screen.getByTestId('showFeatureDescriptionSwitch');
		const checkbox: HTMLInputElement = screen.getByTestId('showFeatureDescription');
		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');

		expect(checkbox).toBeInTheDocument();
		expect(checkbox.checked).toBe(initialOptions.showFeatureDescription);

		expect(textarea).toBeInTheDocument();
		expect(textarea.value).toBe(initialOptions.featureDescription);

		expect(descriptionSwitch).toBeInTheDocument();
	});

	test('Changing Show Feature Description works', async () => {
		const checkbox: HTMLInputElement = screen.getByTestId('showFeatureDescription');
		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');

		// Initially hidden
		expect(textarea).toHaveAttribute('hidden');

		// Click to show
		await act(async () => {
			fireEvent.click(checkbox);
		});

		expect(textarea).not.toHaveAttribute('hidden');
	});

	test('Feature Description textarea input works', async () => {
		const textarea: HTMLTextAreaElement = screen.getByTestId('featureDescription');
		const checkbox: HTMLInputElement = screen.getByTestId('showFeatureDescription');

		// First show the textarea
		fireEvent.click(checkbox);

		// Wait for the state to update
		await waitFor(() => {
			expect(textarea).not.toHaveAttribute('hidden');
		});

		// Then test input
		fireEvent.change(textarea, { target: { value: 'Integration test description' } });

		expect(textarea.value).toBe('Integration test description');
	});
});
