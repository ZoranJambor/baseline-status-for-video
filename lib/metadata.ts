import type { Metadata } from 'next';

export const meta: Metadata = {
	metadataBase: new URL('http://localhost:3000'),
	title: 'Baseline Status for Video',
	description: 'The React Framework for the Web',
	generator: 'Next.js',
	applicationName: 'Baseline Status for Video',
	keywords: ['Next.js', 'React', 'JavaScript', 'Baseline', 'CSS'],
	authors: [{ name: 'Zoran Jambor', url: 'https://zoranjambor.com' }],
	openGraph: {
		images: '/baseline-status-for-video-og-image.jpg',
	},
	icons: {
		icon: [
			{ url: '/favicon.ico', sizes: 'any' },
			{ url: '/icon.png', type: 'image/png', sizes: '32x32' },
		],
		apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
	},
};
