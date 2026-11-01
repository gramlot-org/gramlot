import type {DevicePhoto} from './handlers/device-handler.js';
/** Explicit browser implementation of the existing camera capability. */
export class BrowserCameraProvider {
    constructor(options: {document: Document});
    readonly capabilities: readonly ('camera')[];
    takePhoto(signal: AbortSignal): Promise<DevicePhoto>;
    choosePhoto(signal: AbortSignal): Promise<DevicePhoto>;
}
