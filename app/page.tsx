'use client';

// React
import { useReducer, useState, useEffect } from 'react';

// Chakra UI
import { Box } from '@chakra-ui/react';

// Lib
import { initialOptions } from '@/lib/defaults';
import optionsReducer from '@/lib/options-reducer';

// Components
import Main from '@/components/scene/main';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarOptions from '@/components/sidebar-options';

// Styles
import styles from '@/app/page.module.css';

export default function Home() {
	const [options, dispatch] = useReducer(optionsReducer, initialOptions);
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
