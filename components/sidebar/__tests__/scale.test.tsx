/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';

// Components
import Home from '@/app/page';

// Baseline Status Web Component needs to be mocked
vi.mock('@/components/sidebar/scale');

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Option Size / Scale', () => {
	test('CSS Property is rendered on the web component', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		expect(baselineStatusMock).toHaveStyle({
			'--scale': initialOptions.scale.toString(),
		});
	});

	test('Value can be changed', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		const input = screen.getByTestId('scale');

		fireEvent.change(input, { target: { value: 2 } });
		await waitFor(() => {
			expect(baselineStatusMock).toHaveStyle({ '--scale': '2' });
		});
	});
});
