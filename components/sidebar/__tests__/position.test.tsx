/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { positions } from '@/components/sidebar/position';

// Components
import Home from '@/app/page';
import webComponentStyles from '@/components/scene/baseline-status.module.css';

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Component Position', () => {
	test('Position icons are rendered', () => {
		for (const position of positions) {
			expect(screen.getByTestId(`position-${position.value}`)).toBeInTheDocument();
		}
	});

	test('Changing component position works', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		const positionButton1 = screen.getByTestId(`position-${positions[0].value}`);
		const positionButton2 = screen.getByTestId(`position-${positions[1].value}`);

		// Initial position
		expect(baselineStatusMock).toHaveClass(webComponentStyles[positions[0].value]);

		// Change to second position
		fireEvent.click(positionButton2);
		await waitFor(() => {
			expect(baselineStatusMock).toHaveClass(webComponentStyles[positions[1].value]);
		});

		// Change back to first position
		fireEvent.click(positionButton1);
		await waitFor(() => {
			expect(baselineStatusMock).toHaveClass(webComponentStyles[positions[0].value]);
		});
	});
});
