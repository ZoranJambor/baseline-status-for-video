import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Provider } from '@/components/ui/provider';
import { meta } from '@/lib/metadata';

import '@/app/globals.css';

export const metadata: Metadata = {
	...meta,
};

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

type RootLayout = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayout) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					defer
					data-domain="baseline-status-for-video.css-weekly.com"
					src="https://plausible.io/js/script.file-downloads.outbound-links.tagged-events.js"
				/>
			</head>
			<body className={`dark ${geistSans.variable} ${geistMono.variable}`}>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
