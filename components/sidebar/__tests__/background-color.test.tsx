/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { swatches } from '@/lib/defaults';

// Components
import Home from '@/app/page';

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Component Background Color', () => {
	test('Color swatches are rendered', () => {
		for (const swatch of swatches) {
			expect(screen.getByTestId(swatch.name)).toBeInTheDocument();
		}
	});

	test('Changing Video Background works', async () => {
		const sceneContainer = screen.getByTestId('sceneContainer');
		const swatchButtonGreen = screen.getByTestId(swatches[0].name);
		const swatchButtonPink = screen.getByTestId(swatches[1].name);

		// Initial color
		expect(sceneContainer.getAttribute('data-bg-color')).toBe(swatches[0].name);

		// Change to pink
		fireEvent.click(swatchButtonPink);
		await waitFor(() => {
			expect(sceneContainer.getAttribute('data-bg-color')).toBe(swatches[1].name);
		});

		//Change back to initial
		fireEvent.click(swatchButtonGreen);
		await waitFor(() => {
			expect(sceneContainer.getAttribute('data-bg-color')).toBe(swatches[0].name);
		});
	});
});
