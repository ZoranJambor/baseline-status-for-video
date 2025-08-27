import type { Metadata } from 'next';

export const meta: Metadata = {
	metadataBase: new URL('https://baseline-status-for-video.css-weekly.com/'),
	title: 'Baseline Status for Video',
	description:
		'A handy online tool that will let you easily show Baseline Status in your videos.',
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
