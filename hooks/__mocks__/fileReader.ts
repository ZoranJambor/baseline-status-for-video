export class MockFileReader implements FileReader {
    onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
    onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
    readyState: 0 | 1 | 2 = 0;
    result: string | ArrayBuffer | null = null;
    error: DOMException | null = null;

    readAsDataURL() {
        this.readyState = 1;
        setTimeout(() => {
            if (this.onload) {
                this.result = 'mock-data-url';
                this.readyState = 2;
                this.onload({
                    target: { result: 'mock-data-url' },
                } as ProgressEvent<FileReader>);
            }
        }, 0);
    }

    readonly DONE = 2;
    readonly EMPTY = 0;
    readonly LOADING = 1;
    onabort = null;
    onloadend = null;
    onloadstart = null;
    onprogress = null;
    abort() {}
    readAsArrayBuffer() {}
    readAsBinaryString() {}
    readAsText() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {
        return true;
    }
}