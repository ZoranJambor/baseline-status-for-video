/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';

// Components
import Home from '@/app/page';

// Baseline Status Web Component needs to be mocked
vi.mock('@/components/sidebar/transition-duration');

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Option Transition Duration', () => {
	test('CSS Property is rendered on the web component', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		expect(baselineStatusMock).toHaveStyle({
			'--transition-duration': initialOptions.transitionDuration.toString() + 's',
		});
	});

	test('Value can be changed', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		const input = screen.getByTestId('transitionDuration');

		fireEvent.change(input, { target: { value: 2 } });
		await waitFor(() => {
			expect(baselineStatusMock).toHaveStyle({ '--transition-duration': '2s' });
		});
	});
});
