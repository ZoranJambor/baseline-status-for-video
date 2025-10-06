'use client';

// React
import { useEffect } from 'react';

// Chakra UI
import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { TbExternalLink } from 'react-icons/tb';

// Components
import Header from '@/components/header';
import Footer from '@/components/footer';
import AboutSidebar from '@/components/about-sidebar';

// Styles
import styles from '@/app/page.module.css';
import aboutStyles from '@/app/about/about.module.css';

export default function About() {
	useEffect(() => {
		document.title = 'About - Baseline Status for Video';
	}, []);

	return (
		<>
			<div className={`${styles.layout} ${styles.layoutpage}`} data-testid="page">
				<Box className={`${styles.menu}`}>
					<Header />
					<Footer />
				</Box>
				<Box className={`${styles.page}`}>
					<Box p={10} maxW="4xl" mx="auto">
						<VStack gap={6} align="stretch">
							<Heading as="h1" size="4xl">
								About Baseline Status for Video
							</Heading>

							<Box>
								<Text fontSize="2xl" mb={8}>
									A handy online tool that will let you easily show Baseline Status in
									your videos.
									<br />
								</Text>
								{/* <Image
									src="/baseline-status-for-video-og-image.jpg"
									alt="Baseline Status for Video promo image"
									className={`${aboutStyles.video}`}
								/> */}
								<iframe
									width="560"
									height="315"
									className={`${aboutStyles.video}`}
									src="https://www.youtube.com/embed/Pa9gpjT2nUs?si=qnluyu42zdChF4dR"
									title="How to use Baseline Status for Video "
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									referrerPolicy="strict-origin-when-cross-origin"
									allowFullScreen
								></iframe>
							</Box>

							<Box>
								<Heading as="h2" size="4xl" mb={4}>
									How It Works
								</Heading>
								<Text fontSize="xl" mb={3}>
									Select the Feature ID you want to show, tweak the styling, and hit
									record. You&apos;ll get a short video to download, which you can easily
									import into your editing software.
								</Text>

								<Text fontSize="xl" mb={3}>
									The video background is dark red by default, as the browser logos have
									the least similarity with it, making it easier to set Chroma Key (Green
									Screen) to make the background transparent.
								</Text>

								<Text fontSize="xl" mb={3}>
									The widget is shown on the screen only for a few seconds, so use a
									freeze frame feature in your editing software to make it stay on the
									screen as long as you want.
								</Text>

								<Text fontSize="xl" mb={3}>
									The tool works best with Google Chrome, as it allows you to easily
									capture a pure screen without browser elements (as opposed to Safari and
									Firefox).
								</Text>

								<Text fontSize="xl" mb={3}>
									To use the tool, you&apos;ll need to enable screen recording in your
									browser after you hit <em>Record</em>, but also in your OS for the
									browser you&apos;re using (Screen & System Audio Recording on MacOS).
								</Text>
								<Text fontSize="xl" mb={3}>
									To be perfectly clear and transparent, all recordings are local, only
									available to you on your system—they are not stored nor sent anywhere.
								</Text>
							</Box>

							<Box>
								<Heading as="h2" size="4xl" mb={3}>
									Try It Out
								</Heading>
								<Box as="ol" listStyleType="circle" mb={3} fontSize="xl" ml={4}>
									<li>
										Use the sidebar controls to customize the appearance and behavior of
										your component
									</li>
									<li>Preview your changes in real-time in the main area</li>
									<li>
										Use the recording bar to capture your screen and download the video
									</li>
									<li>
										Press Escape or click to exit fullscreen preview or recording mode
									</li>
								</Box>
							</Box>

							<Box>
								<Heading as="h2" size="4xl" mb={3}>
									Tech Stack
								</Heading>
								<Box as="ol" listStyleType="circle" mb={3} fontSize="xl" ml={4}>
									<li>
										<strong>Framework</strong>: <a href="https://nextjs.org/">Next.js</a>
									</li>
									<li>
										<strong>Language</strong>:{' '}
										<a href="https://www.typescriptlang.org/">TypeScript</a>
									</li>
									<li>
										<strong>UI</strong>: <a href="https://chakra-ui.com/">Chakra UI</a>
									</li>
									<li>
										<strong>Video Processing</strong>:{' '}
										<a href="https://github.com/ffmpegwasm/ffmpeg.wasm">FFmpeg.wasm</a>
									</li>
									<li>
										<strong>Icons</strong>:{' '}
										<a href="https://react-icons.github.io/react-icons/">react-icons</a>,{' '}
										<a href="https://tabler.io/icons">@tabler/icons</a>
									</li>
									<li>
										<strong>Testing</strong>: <a href="https://vitest.dev/">Vitest</a>
									</li>

									<li>
										<strong>Linting</strong>: <a href="https://prettier.io/">Prettier</a>,{' '}
										<a href="https://stylelint.io/">Stylelint</a>,{' '}
										<a href="https://eslint.org/">ESLint</a>
									</li>
								</Box>
							</Box>

							<Box>
								<Heading as="h2" size="4xl" mb={3}>
									Links
								</Heading>
								<Box as="ul" listStyleType="circle" mb={3} fontSize="xl" ml={4}>
									<li>
										<Link
											target="_blank"
											href="https://github.com/ZoranJambor/baseline-status-for-video/"
										>
											Fork on GitHub <TbExternalLink />
										</Link>
									</li>
									<li>
										<Link target="_blank" href="https://css-weekly.com">
											Newsletter <TbExternalLink />
										</Link>
									</li>
									<li>
										<Link target="_blank" href="https://buymeacoffee.com/cssweekly">
											Buy me a Coffee <TbExternalLink />
										</Link>
									</li>
								</Box>
							</Box>
						</VStack>
					</Box>
				</Box>
				<AboutSidebar />
			</div>
		</>
	);
}
