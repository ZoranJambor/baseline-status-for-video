import { Box, Heading } from '@chakra-ui/react';

export default function Stats() {
	return (
		<Box
			// style={{ display: 'none' }}
			px="10"
			pt="7"
			pb="10"
			// className={`${pageStyles.container} ${styles.sidebar} ${styles.stats}`}
		>
			<Heading as="h2">My Stats</Heading>

			<p>
				<strong>50</strong>
				<br />
				Videos Downloaded
			</p>

			<p>
				<strong>5h 20min 5s</strong>
				<br />
				Footage Recorded
			</p>
		</Box>
	);
}
