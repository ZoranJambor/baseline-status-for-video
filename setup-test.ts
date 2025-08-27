import '@testing-library/jest-dom/vitest';
import { JSDOM } from 'jsdom';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';
import 'vitest-axe/extend-expect';

const { window } = new JSDOM();

// ResizeObserver mock
vi.stubGlobal('ResizeObserver', ResizeObserver);
window['ResizeObserver'] = ResizeObserver;

// IntersectionObserver mock
const IntersectionObserverMock = vi.fn(() => ({
	disconnect: vi.fn(),
	observe: vi.fn(),
	takeRecords: vi.fn(),
	unobserve: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
window['IntersectionObserver'] = IntersectionObserverMock;

// Scroll Methods mock
window.Element.prototype.scrollTo = () => {};
window.Element.prototype.scrollIntoView = () => {};

// requestAnimationFrame mock
window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60);

// URL object mock
window.URL.createObjectURL = () => 'https://i.pravatar.cc/300';
window.URL.revokeObjectURL = () => {};

// navigator mock
Object.defineProperty(window, 'navigator', {
	value: {
		clipboard: {
			writeText: vi.fn(),
		},
	},
});

// matchmedia mock
if (typeof window.matchMedia !== 'function') {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // deprecated
			removeListener: vi.fn(), // deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
}

// Override globalThis
Object.assign(global, { window, document: window.document });

// --- FFmpeg mock with per-test customization ---
let nextMockFFmpegInstance: unknown = null;
function createMockFFmpegInstance() {
	if (nextMockFFmpegInstance) {
		const inst = nextMockFFmpegInstance;
		nextMockFFmpegInstance = null;
		return inst;
	}
	return {
		load: vi.fn().mockResolvedValue(undefined),
		writeFile: vi.fn().mockResolvedValue(undefined),
		exec: vi.fn().mockResolvedValue(undefined),
		readFile: vi.fn().mockResolvedValue(new Blob(['mock-mp4-data'])),
	};
}

vi.mock('@ffmpeg/ffmpeg', () => ({
	FFmpeg: vi.fn().mockImplementation(() => createMockFFmpegInstance()),
}));

vi.mock('@ffmpeg/util', () => ({
	fetchFile: vi.fn().mockResolvedValue(new Blob(['mock-file-data'])),
}));

// Expose a setter for the next FFmpeg instance for per-test customization
(
	global as unknown as { setNextMockFFmpegInstance: (inst: unknown) => void }
).setNextMockFFmpegInstance = (inst: unknown) => {
	nextMockFFmpegInstance = inst;
};

// Mock <baseline-status> component, it's essential
vi.mock('@/components/scene/baseline-status', async () => {
	const { BaselineStatusComponentMock } = await import(
		'@/components/scene/__mocks__/baseline-status'
	);
	return { BaselineStatusComponent: BaselineStatusComponentMock };
});
