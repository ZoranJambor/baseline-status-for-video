/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';
// import preloadAll from 'jest-next-dynamic';

// Components
import Home from '@/app/page';
import styles from '@/app/page.module.css';

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Basic Functionality', () => {
	test('The H1 headline is rendered', () => {
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
			'Baseline Status for Video'
		);
	});

	test('Baseline Status Web Component is rendered', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		expect(baselineStatusMock).toBeInTheDocument();
		expect(baselineStatusMock).toHaveAttribute('featureId');
		expect(baselineStatusMock.getAttribute('featureId')).toBe(initialOptions.featureId);
	});

	test('Hidding UI works', async () => {
		const page = screen.getByTestId('page');
		const button = screen.getByTestId('toggleUi');
		expect(button).toBeInTheDocument();

		// By default, UI is visible
		expect(page).not.toHaveClass(styles.hideui);

		// UI should be hidden after clicking toggleUi button
		fireEvent.click(button);
		await waitFor(() => {
			expect(page).toHaveClass(styles.hideui);
		});
	});
});
