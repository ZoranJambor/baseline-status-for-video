import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
	globalCss: {
		html: {
			colorPalette: 'purple',
		},
	},
});

const system = createSystem(defaultConfig, config);

export { system };
