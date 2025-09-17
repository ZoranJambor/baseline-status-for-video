'use client';

// React
import { useState, useEffect } from 'react';

// Chakra UI
import { Box } from '@chakra-ui/react';

// Hooks
import { usePersistedState } from '@/hooks/usePersistedState';

// Components
import Main from '@/components/scene/main';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarOptions from '@/components/sidebar-options';

// Styles
import styles from '@/app/page.module.css';
import loader from '@/app/loadership.module.css';

export default function Home() {
	const [options, dispatch, isLoaded] = usePersistedState();
	const [hideUI, setHideUI] = useState<boolean>(false);
	const [hideWidget, setHideWidget] = useState<boolean>(false);
	const hideClass = hideUI ? styles.hideui : '';

	useEffect(() => {
		const keyDownHandler = (e: globalThis.KeyboardEvent) => {
			if (e.code === 'Escape') {
				setHideUI(false);
			}
		};
		document.addEventListener('keydown', keyDownHandler);

		// clean up
		return () => {
			document.removeEventListener('keydown', keyDownHandler);
		};
	}, []);

	// Loading screen
	if (!isLoaded) {
		return (
			<div className={`${styles.layout}`} data-testid="loading-page">
				<Box className={styles.menu}>
					<Header />
					<Footer />
				</Box>
				<div className={`${loader.loadership} ${styles.loader}`}>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<Box className={`${styles.container} ${styles['sidebar-loading']}`}></Box>
			</div>
		);
	}

	return (
		<>
			<div className={`${styles.layout} ${hideClass}`} data-testid="page">
				<Box className={`${styles.menu}`}>
					<Header />
					<Footer />
				</Box>
				<Main
					options={options}
					dispatch={dispatch}
					hideUI={hideUI}
					setHideUI={setHideUI}
					hideWidget={hideWidget}
					setHideWidget={setHideWidget}
				/>
				<SidebarOptions
					options={options}
					dispatch={dispatch}
					hideUI={hideUI}
					setHideUI={setHideUI}
					setHideWidget={setHideWidget}
				/>
			</div>
		</>
	);
}
