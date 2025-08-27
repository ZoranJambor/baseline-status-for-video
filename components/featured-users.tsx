'use client';

import { Box, Heading, Text, VStack, HStack, Link, Button } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { TbMail, TbExternalLink } from 'react-icons/tb';

type FeaturedUser = {
	name: string;
	role: string;
	company?: string;
	avatar?: string;
	message: string;
	videoUrl?: string;
	website?: string;
};

const featuredUsers: FeaturedUser[] = [
	{
		name: 'Zoran Jambor',
		role: 'Frontend Developer',
		company: 'CSS Weekly',
		message:
			'I created a Baseline Status for Video to scratch my own itch and make it easier to show browser support in my videos. I might be biased here, but I really like it. :)',
		videoUrl: 'https://youtube.com/@cssweekly',
		avatar: '/zoranjambor.jpeg',
	},
];

export default function FeaturedUsers() {
	return (
		<Box>
			<Heading as="h2" size="2xl" mb={4}>
				Who&apos;s Using Baseline Status for Video
			</Heading>

			<VStack gap={6} align="stretch">
				{featuredUsers.map((user, index) => (
					<Box
						key={index}
						p={8}
						border="1px"
						borderColor="gray.200"
						borderRadius="md"
						bg="white"
						_dark={{ bg: 'gray.900', borderColor: 'gray.700' }}
					>
						<HStack gap={3} mb={3}>
							<Avatar name={user.name} src={user.avatar} size="md" />
							<Box>
								<Text fontWeight="bold" fontSize="md">
									{user.name}
								</Text>
								<Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
									{user.role}
									{user.company && `, ${user.company}`}
								</Text>
							</Box>
						</HStack>
						<Text fontSize="md" fontStyle="italic" mb={3} lineHeight="tall">
							{user.message}
						</Text>
						{user.videoUrl && (
							<Link
								href={user.videoUrl}
								target="_blank"
								display="inline-flex"
								alignItems="center"
								gap={1}
								fontSize="sm"
								color="blue.500"
							>
								View More <TbExternalLink />
							</Link>
						)}
					</Box>
				))}

				<Box
					p={8}
					border="2px dashed"
					borderColor="blue.300"
					borderRadius="md"
					bg="blue.50"
					_dark={{ bg: 'blue.900', borderColor: 'blue.600' }}
				>
					<Heading
						as="h3"
						size="xl"
						mb={3}
						color="blue.700"
						_dark={{ color: 'blue.300' }}
					>
						Share Your Story
					</Heading>
					<Text fontSize="md" mb={4} lineHeight="tall">
						Are you using Baseline Status for Video in your projects? I&apos;d love to
						feature you here! Send me the link to a video where you&apos;re using Baseline
						Status for Video, and I&apos;ll showcase it here.
					</Text>
					<Button
						colorScheme="blue"
						size="sm"
						onClick={() =>
							window.open(
								"mailto:info@css-weekly.com?subject=Baseline Status for Video Feature Request&body=Hi! I'd like to share how I'm using Baseline Status for Video. Here's my video: [link to your video]"
							)
						}
					>
						<TbMail style={{ marginRight: 4 }} /> Submit Your Video
					</Button>
				</Box>
			</VStack>
		</Box>
	);
}
