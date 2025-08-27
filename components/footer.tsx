import { Box, Link } from '@chakra-ui/react';
import styles from '@/components/footer.module.css';

// Icons
// prettier-ignore
import { FaPatreon, FaBluesky, FaSquareXTwitter, FaCodepen, FaTiktok } from 'react-icons/fa6';
import { FaYoutube } from 'react-icons/fa';
import { PiStickerFill, PiChalkboardTeacherFill } from 'react-icons/pi';
import { SiBuymeacoffee } from 'react-icons/si';

export default function Footer() {
	return (
		<Box className={styles.footer}>
			<Box className={styles.author}>
				<p>
					Built by{' '}
					<Link href="https://zoranjambor.com" target="_blank">
						Zoran Jambor
					</Link>
					,
					<br />
					<Link href="https://css-weekly.com" target="_blank">
						CSS Weekly
					</Link>
				</p>
				<ul className={styles.social}>
					<li>
						<Link
							href="https://www.youtube.com/@CSSWeekly?sub_confirmation=1"
							target="_blank"
						>
							<FaYoutube title="Subscribe to CSS Weekly on YouTube" />
						</Link>
					</li>
					<li>
						<Link href="https://bsky.app/profile/cssweekly.com" target="_blank">
							<FaBluesky title="Follow CSS Weekly on Bluesky" />
						</Link>
					</li>
					<li>
						<Link href="https://x.com/CSSWeekly" target="_blank">
							<FaSquareXTwitter title="Follow CSS Weekly on X" />
						</Link>
					</li>
					<li>
						<Link href="https://codepen.io/ZoranJambor" target="_blank">
							<FaCodepen title="Follow CSS Weekly on CodePen" />
						</Link>
					</li>
					<li>
						<Link href="https://www.tiktok.com/@CSSWeekly" target="_blank">
							<FaTiktok title="Follow CSS Weekly on TikTok" />
						</Link>
					</li>
					{/* <li>
							<Link href="#">
								<IoMail title="Subscribe to Newsletter" />
							</Link>
						</li> */}
					<li>
						<Link href="https://patreon.com/cssweekly" target="_blank">
							<FaPatreon title="Support Me on Patren" />
						</Link>
					</li>
					<li>
						<Link href="https://buymeacoffee.com/cssweekly" target="_blank">
							<SiBuymeacoffee title="Buy Me a Coffee" />
						</Link>
					</li>
					{/* <li>
							<Link href="#" target="_blank">
								<FaGithub title="Sponsor Me on GitHub" />
							</Link>
						</li> */}
					<li>
						<Link href="https://stickers.css-weekly.com" target="_blank">
							<PiStickerFill title="Buy a CSS Stickers Pack" />
						</Link>
					</li>
					<li>
						<Link href="https://masteringlinting.com" target="_blank">
							<PiChalkboardTeacherFill title="Enroll in a Course" />
						</Link>
					</li>
				</ul>
			</Box>
		</Box>
	);
}
