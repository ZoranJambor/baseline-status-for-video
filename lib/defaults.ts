import { Options } from '@/lib/definitions';

// ChakraUI color picker accepts hsla format,
// that's why it must be used here
export const swatches = [
	{ name: 'red', code: 'hsla(333.6, 90.4%, 16.3%, 1)', outline: 'hsl(0deg 0% 100%)' },
	{ name: 'green', code: 'hsla(111, 100%, 50%, 1)', outline: 'hsl(0deg 0% 0%)' },
	{ name: 'pink', code: 'hsla(300, 96.8%, 48.6%, 1)', outline: 'hsl(0deg 0% 0%)' },
	{ name: 'hotpink', code: 'hsla(330, 96.8%, 48.6%, 1)', outline: 'hsl(0deg 0% 0%)' },
	{ name: 'blue', code: 'hsla(240, 96.8%, 48.6%, 1)', outline: 'hsl(0deg 0% 100%)' },
	{ name: 'skyblue', code: 'hsla(210, 96.8%, 48.6%, 1)', outline: 'hsl(0deg 0% 100%)' },
];

/* prettier-ignore */
export const transitions = [
	{ label: 'ease', value: 'ease' },
	{ label: 'ease-in-out', value: 'ease-in-out' },
	{ label: 'sine', value: 'cubic-bezier(0.36, 0, 0.64, 1)' },
	{ label: 'quad', value: 'cubic-bezier(0.44, 0, 0.56, 1)' },
	{ label: 'cubic', value: 'cubic-bezier(0.66, 0, 0.34, 1)' },
	{ label: 'quart', value: 'cubic-bezier(0.78, 0, 0.22, 1)' },
	{ label: 'expo', value: 'cubic-bezier(0.9, 0, 0.1, 1)' },
	{ label: 'jump', value: 'cubic-bezier(1, 0, 0, 1)' },
	{ label: 'anticipate', value: 'cubic-bezier(0.8, -0.4, 0.5, 1)' },
	{ label: 'glide', value: 'linear(0, 0.012 0.9%, 0.049 2%, 0.409 9.3%, 0.513 11.9%, 0.606 14.7%, 0.691 17.9%, 0.762 21.3%, 0.82 25%, 0.868 29.1%, 0.907 33.6%, 0.937 38.7%, 0.976 51.3%, 0.994 68.8%, 1)' },
	{ label: 'overshot', value: 'linear(0, -0.01 4.8%, -0.044 9.4%, -0.226 23.1%, -0.271 27.7%, -0.28 30.1%, -0.276 32.4%, -0.227 36.6%, -0.108 40.8%, 0.083 44.7%, 0.76 53%, 1.006 56.9%, 1.175 61.2%, 1.229 63.5%, 1.264 65.9%, 1.28 69.3%, 1.265 73.1%, 1.224 77.1%, 1.044 90.6%, 1.01 95.2%, 1)' },
	{ label: 'bounce', value: 'linear(0, 1 44.7%, 0.898 51.8%, 0.874 55.1%, 0.866 58.4%, 0.888 64.3%, 1 77.4%, 0.98 84.5%, 1)' },
	{ label: 'spring', value: 'linear(0, 0.008 1.1%, 0.031 2.2%, 0.129 4.8%, 0.257 7.2%, 0.671 14.2%, 0.789 16.5%, 0.881 18.6%, 0.957 20.7%, 1.019 22.9%, 1.063 25.1%, 1.094 27.4%, 1.114 30.7%, 1.112 34.5%, 1.018 49.9%, 0.99 59.1%, 1)' },
	{ label: 'linear', value: 'linear' },
];

export const initialOptions: Options = {
	featureId: 'anchor-positioning',
	color: swatches[0],
	position: 'bottom',
	scale: 1.4,
	videoLength: 1,
	videoDelay: 1,
	marginBlock: 5,
	marginInline: 5,
	transitionDuration: 1,
	transitionFunction: 'cubic-bezier(0.66, 0, 0.34, 1)',
	colorScheme: 'light',
};
