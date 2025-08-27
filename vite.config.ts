import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	// ...
	plugins: [tsconfigPaths(), react()],

	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './setup-test.ts',
		coverage: {
			exclude: [
				...coverageConfigDefaults.exclude,
				'components/ui',
				'next.config.ts',

				// Required for the entire app, can't render it separately in test
				'app/layout.tsx',

				// These are mocked
				'components/scene/baseline-status.tsx',
				'components/sidebar/scale.tsx',
				'components/sidebar/spacing.tsx',
				'components/sidebar/transition-duration.tsx',
			],
		},

		// Supress @zag-js random warnings
		onConsoleLog(log) {
			if (log.includes('@zag-js')) {
				return false;
			}
		},
	},
});
