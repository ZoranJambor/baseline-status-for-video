/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';

// Components
import Home from '@/app/page';

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

vi.mock('@/components/sidebar/transition-function');

// Only select needs to be mocked, everything else can be
// tested properly, hece the two files
describe('Option Transition Function Select', () => {
	test('Changing Transition Function works', async () => {
		const select: HTMLSelectElement = screen.getByTestId('transitionFunction');
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		// act(() => {
		fireEvent.change(select, { target: { value: 'ease' } });
		// });

		expect(select.value).toBe('ease');
		expect(baselineStatusMock).toHaveStyle({
			'--transition-function': 'ease',
		});
	});
});
