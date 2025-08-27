import { Button } from '@chakra-ui/react';
import { render } from '@/lib/test-render';
import { screen } from '@testing-library/react';

describe('Chakra UI', () => {
	test('Renders a button', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});
});
