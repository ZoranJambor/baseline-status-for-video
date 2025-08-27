/**
 * @vitest-environment jsdom
 */
import { meta as metadata } from '@/lib/metadata';

describe('Page Metadata', () => {
	test('title', () => {
		expect(metadata.title).toBeTruthy();
	});

	test('description', () => {
		expect(metadata.description).toBeTruthy();
	});

	test('og:image', () => {
		expect(metadata.openGraph?.images).toBeTruthy();
	});
});
