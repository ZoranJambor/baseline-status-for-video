'use client';

import { Box } from '@chakra-ui/react';
import FeaturedUsers from '@/components/featured-users';
import styles from '@/app/page.module.css';

export default function AboutSidebar() {
	return (
		<Box className={styles.sidebar}>
			<FeaturedUsers />
		</Box>
	);
}
