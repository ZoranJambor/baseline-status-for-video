/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';

// Components
import Home from '@/app/page';

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Feature Id', () => {
	test('Feature Id input is rendered', async () => {
		const input: HTMLInputElement = screen.getByTestId('featureId');

		// BaseLineStatus is loaded with next/dynamic
		// so we're making sure it's loaded here
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');

		expect(input).toBeInTheDocument();
		expect(input.value).toBe(initialOptions.featureId);
		expect(baselineStatusMock.getAttribute('featureId')).toBe('anchor-positioning');
	});

	test('Changing Feature Id works', async () => {
		const input: HTMLInputElement = screen.getByTestId('featureId');
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');

		fireEvent.change(input, { target: { value: 'margin' } });
		await waitFor(() => {
			expect(baselineStatusMock.getAttribute('featureId')).toBe('margin');
		});
		expect(input.value).toBe('margin');

		// Test changing feature id to empty string (it shouldn't rerender the component)
		fireEvent.change(input, { target: { value: '' } });
		await waitFor(() => {
			expect(baselineStatusMock.getAttribute('featureId')).toBe('margin');
		});
		expect(input.value).toBe('');

		fireEvent.change(input, { target: { value: ' ' } });
		await waitFor(() => {
			expect(baselineStatusMock.getAttribute('featureId')).toBe('margin');
		});
		expect(input.value).toBe(' ');

		fireEvent.change(input, { target: { value: ' padding ' } });
		await waitFor(() => {
			expect(baselineStatusMock.getAttribute('featureId')).toBe('padding');
		});
		expect(input.value).toBe(' padding ');
	});
});
