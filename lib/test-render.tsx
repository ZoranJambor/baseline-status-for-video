// ./lib/test-render.tsx
import { Provider } from '@/components/ui/provider';
import { render as rtlRender } from '@testing-library/react';

export function render(ui: React.ReactNode) {
	return rtlRender(<>{ui}</>, {
		wrapper: (props: React.PropsWithChildren) => <Provider>{props.children}</Provider>,
	});
}
