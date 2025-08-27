/**
 * @vitest-environment jsdom
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-render';
import { initialOptions } from '@/lib/defaults';
import { positions } from '@/components/sidebar/position';

// Components
import Home from '@/app/page';
import webComponentStyles from '@/components/scene/baseline-status.module.css';

// Baseline Status Web Component needs to be mocked
vi.mock('@/components/sidebar/spacing');

beforeEach(async () => {
	await waitFor(() => {
		render(<Home />);
	});
});

describe('Component Margin Spacing', () => {
	test('CSS Properties are rendered on the web component', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		expect(baselineStatusMock).toHaveStyle({
			'--margin-block': initialOptions.marginBlock.toString() + 'rem',
			'--margin-inline': initialOptions.marginInline.toString() + 'rem',
		});
	});

	test('Margin Block Value can be changed', async () => {
		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');
		const inputBlock = screen.getByTestId('marginBlock');

		fireEvent.change(inputBlock, { target: { value: 2 } });
		await waitFor(() => {
			expect(baselineStatusMock).toHaveStyle({ '--margin-block': '2rem' });
		});
	});

	test('Margin Inline Value can be changed', async () => {
		// Initially marginInline is hidden
		expect(screen.queryByTestId('marginInline')).not.toBeInTheDocument();

		await waitFor(() => {
			screen.getByTestId('BaselineStatusComponent');
		});
		const baselineStatusMock = screen.getByTestId('BaselineStatusComponent');

		// Change the position to bottom-left, so the marginInline input is rendered
		fireEvent.click(screen.getByTestId(`position-${positions[2].value}`));
		await waitFor(() => {
			expect(baselineStatusMock).toHaveClass(webComponentStyles[positions[2].value]);
		});

		const inputInline = screen.getByTestId('marginInline');
		fireEvent.change(inputInline, { target: { value: 2 } });
		await waitFor(() => {
			expect(baselineStatusMock).toHaveStyle({ '--margin-inline': '2rem' });
		});
	});
});
