/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';
import baselineStyles from '@/components/scene/baseline-status.module.css';

// Components
import Home from '@/app/page';

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

// Baseline Status Web Component needs to be mocked
vi.mock('@/components/sidebar/transition-duration');

describe('Option Transition Duration', () => {
	test('Elements are rendered', async () => {
		const select: HTMLSelectElement = screen.getByTestId('transitionFunction');

		// BaseLineStatus is loaded with next/dynamic
		// so we're making sure it's loaded here
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		const previewButton = screen.getByTestId('previewButton');

		expect(select).toBeInTheDocument();
		expect(previewButton).toBeInTheDocument();
		expect(select.value).toBe(initialOptions.transitionFunction);
		expect(baselineStatusMock).toHaveStyle({
			'--transition-function': initialOptions.transitionFunction,
		});

		const input = screen.getByTestId('transitionDuration');

		// Change transition duration to speed up the test
		fireEvent.change(input, { target: { value: 0.1 } });
		await waitFor(() => {
			expect(baselineStatusMock).toHaveStyle({ '--transition-duration': '0.1s' });
		});

		// When preview is clicked, the preview button is
		// disabled, the component is hidden, then shown
		// after the timeout specified with
		// transition-duration
		await act(async () => {
			fireEvent.click(previewButton);
		});
		expect(baselineStatusMock).toHaveClass(baselineStyles.hidewidget);
		expect(previewButton).toBeDisabled();

		await waitFor(() => {
			expect(baselineStatusMock).not.toHaveClass(baselineStyles.hidewidget);
			expect(previewButton).not.toBeDisabled();
		});
	});
});
