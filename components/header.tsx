import { Box, Heading, Link, Image } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { TbExternalLink } from 'react-icons/tb';

import styles from '@/components/header.module.css';

export default function Header() {
	const pathname = usePathname();

	return (
		<Box className={styles.container}>
			<Heading className={styles.logo} as="h1" mb={0} color="purple.100">
				<Link href="/" display="flex" flexDirection="column" alignItems="start" gap={4}>
					<Image
						src="/baseline-status-for-video.svg"
						alt="Baseline Status for Video Logo"
						height="50px"
						width="auto"
					/>
					Baseline Status for Video
				</Link>
			</Heading>
			<p className={styles.tagline}>
				A handy tool that will let you easily show Baseline Status in your videos.
			</p>
			<Box className={styles.menu} color="purple.200">
				<ul>
					<li>
						<Link href="/" className={pathname === '/' ? styles.active : ''}>
							Record Video
						</Link>
					</li>
					<li>
						<Link href="/about" className={pathname === '/about' ? styles.active : ''}>
							About
						</Link>
					</li>
					<li>
						<Link
							href="/contact"
							className={pathname === '/contact' ? styles.active : ''}
						>
							Contact
						</Link>
					</li>
					<li>
						<Link target="_blank" href="">
							Fork on GitHub <TbExternalLink />
						</Link>
					</li>
					<li>
						<Link target="_blank" href="https://buymeacoffee.com/cssweekly">
							Buy me a Coffee <TbExternalLink />
						</Link>
					</li>
					<li>
						<Link target="_blank" href="https://css-weekly.com">
							Newsletter <TbExternalLink />
						</Link>
					</li>
				</ul>
				{/* <Link
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn
				</Link>
				<br />
				<a
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Examples
				</a>
				<br />
				<a
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Go to nextjs.org →
				</a>
				<br />

				<a
					href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Deploy now
				</a>
				<br />
				<a
					href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Read our docs
				</a>
				*/}
			</Box>
		</Box>
	);
}
