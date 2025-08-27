import { vi } from 'vitest';

export const mockTrack = {
    stop: vi.fn(),
};

export const mockStream = {
    getTracks: () => [mockTrack],
    getVideoTracks: () => [
        {
            stop: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            enabled: true,
            id: 'mock-video-track',
            kind: 'video',
            label: 'Mock Video Track',
            muted: false,
            readyState: 'live',
        },
    ],
    getAudioTracks: () => [],
    addTrack: vi.fn(),
    removeTrack: vi.fn(),
    clone: vi.fn(),
    active: true,
    id: 'mock-stream-id',
    onaddtrack: null,
    onremovetrack: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    eventListener: vi.fn(),
} as unknown as MediaStream;

export const mockMediaRecorder = {
    start: vi.fn(),
    stop: vi.fn(),
    ondataavailable: null as ((event: { data: Blob }) => void) | null,
    onstop: null as ((event: { target: { mimeType: string } }) => void) | null,
};

export const mockMediaRecorderInstance = {
    ...mockMediaRecorder,
    state: 'inactive',
    stream: mockStream,
    videoBitsPerSecond: 0,
    audioBitsPerSecond: 0,
    onstart: null as ((event: Event) => void) | null,
    onpause: null as ((event: Event) => void) | null,
    onresume: null as ((event: Event) => void) | null,
    onerror: null as ((event: Event) => void) | null,
    onwarning: null as ((event: Event) => void) | null,
};

// Patch start to set state to 'recording'
mockMediaRecorderInstance.start = vi.fn(function () {
    mockMediaRecorderInstance.state = 'recording';
});

export const MockMediaRecorder = vi.fn().mockImplementation(() => mockMediaRecorderInstance);

(MockMediaRecorder as unknown as typeof MediaRecorder).isTypeSupported = vi
    .fn()
    .mockReturnValue(true);