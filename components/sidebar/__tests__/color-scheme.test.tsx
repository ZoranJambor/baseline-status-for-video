/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';

// Components
import Home from '@/app/page';
import webComponentStyles from '@/components/scene/baseline-status.module.css';

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Option Color Scheme', () => {
	test('Color Scheme icons are rendered', () => {
		expect(screen.getByTestId('colorSchemeLight')).toBeInTheDocument();
		expect(screen.getByTestId('colorSchemeDark')).toBeInTheDocument();
	});

	test('Changing color scheme works', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		const light = screen.getByTestId('colorSchemeLight');
		const dark = screen.getByTestId('colorSchemeDark');

		// Initial colorScheme
		expect(baselineStatusMock).toHaveClass(
			webComponentStyles[initialOptions.colorScheme]
		);

		// Change to second position
		fireEvent.click(dark);
		await waitFor(() => {
			expect(baselineStatusMock).toHaveClass(webComponentStyles['dark']);
		});

		fireEvent.click(light);
		await waitFor(() => {
			expect(baselineStatusMock).toHaveClass(webComponentStyles['light']);
		});
	});
});
