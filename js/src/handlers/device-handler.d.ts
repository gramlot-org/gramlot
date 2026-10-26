/** JSON scalar SQLite subset used by the native proof of concept. */
export interface DeviceDatabase {
    query(sql: string, params?: unknown[] | Record<string, unknown>): Promise<Record<string, unknown>[]>;
    execute(sql: string, params?: unknown[] | Record<string, unknown>): Promise<void>;
    close(): Promise<void>;
}
import type {Handler} from './handler.js';
import type {Gramlot} from '../gramlot.js';

export type DeviceName = 'appinfo' | 'location';
export interface AppInfo { id: string; name: string; version: string; build: string; }
export interface DeviceLocation { latitude: number; longitude: number; accuracy: number; timestamp: number; }
export interface DeviceClipboard { text: string; }
export interface DeviceAudio { url: string; mimeType: string; duration: number; }
export interface DeviceAudioSession { share(signal: AbortSignal): Promise<{activity: string}>; stop(): Promise<DeviceAudio>; dispose(): Promise<void>; }
export interface DeviceNetwork { connected: boolean; type: 'none' | 'unknown' | 'wifi' | 'cellular'; }
export type DeviceLifecycleEvent = {kind: 'state'; active: boolean} | {kind: 'pause' | 'resume'};
export type DeviceHapticStyle = 'light' | 'medium' | 'heavy';
export interface DeviceBarcode { text: string; format: string; }
export interface DevicePhoto { url: string; format: string; }
export interface DeviceBiometrics { verified: true; }
export interface DeviceNotificationRequest { id: number; title: string; body: string; delay: number; }
export interface DeviceNotificationSchedule { id: number; at: number; }
export type DeviceNotificationEvent = { id: number; title: string; body: string } &
    ({ kind: 'received' } | { kind: 'action'; actionId: string });
export interface DeviceLinkRequest { id: string; url: string; }
export interface DeviceShortcutRequest { id: string; destination: string; }
export interface DevicePushRegistration { token: string; }
export type DevicePushEvent = { kind: 'registration'; token: string } |
    { kind: 'registrationError'; error: Error } |
    ({ id: string; title: string; body: string; messageId: string; destination: string } &
    ({ kind: 'received' } | { kind: 'action'; actionId: string }));
export interface DeviceOrientation { type: 'portrait' | 'landscape'; direction: 'primary' | 'secondary'; timestamp: number; }
export type DeviceMotionEvent = {kind: 'state'; watching: boolean} | {kind: 'sample'; x: number; y: number; z: number; timestamp: number} | {kind: 'error'; error: Error};
/** Provider boundary; capability names and result shapes never expose a native SDK. */
export interface DeviceProvider {
    openDatabase(name: string, signal: AbortSignal): Promise<DeviceDatabase>;
    readonly capabilities: readonly (DeviceName | 'camera' | 'biometrics' | 'notifications' | 'push' | 'shortcuts' | 'barcode' | 'network' | 'lifecycle' | 'haptics' | 'audio' | 'clipboard' | 'links' | 'orientation' | 'gyroscope' | 'accelerometer')[];
    startOrientationEvents(callback: (state: DeviceOrientation) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    startGyroscopeUpdates(callback: (event: DeviceMotionEvent) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    startAccelerometerUpdates(callback: (event: DeviceMotionEvent) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    copyText(text: string, signal: AbortSignal): Promise<void>;
    pasteText(signal: AbortSignal): Promise<DeviceClipboard>;
    startAudioRecording(onInterruption: (error: Error) => void, signal: AbortSignal): Promise<DeviceAudioSession>;
    startNetworkEvents(callback: (state: DeviceNetwork) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    startLifecycleEvents(callback: (event: DeviceLifecycleEvent) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    vibrate(duration: number, signal: AbortSignal): Promise<void>;
    impact(style: DeviceHapticStyle, signal: AbortSignal): Promise<void>;
    readAppInfo(): Promise<AppInfo>;
    readLocation(): Promise<DeviceLocation>;
    scanBarcode(signal: AbortSignal): Promise<DeviceBarcode>;
    takePhoto(signal: AbortSignal): Promise<DevicePhoto>;
    choosePhoto(signal: AbortSignal): Promise<DevicePhoto>;
    verifyBiometrics(signal: AbortSignal): Promise<void>;
    startLinkEvents(callback: (request: DeviceLinkRequest | null, error: Error | null) => void,
        signal: AbortSignal): Promise<() => Promise<void>>;
    startShortcutEvents(callback: (request: DeviceShortcutRequest | null, error: Error | null) => void,
        signal: AbortSignal): Promise<() => Promise<void>>;
    registerPush(signal: AbortSignal): Promise<void>;
    startPushEvents(callback: (event: DevicePushEvent) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    scheduleNotification(request: DeviceNotificationRequest, signal: AbortSignal): Promise<DeviceNotificationSchedule>;
    startNotificationEvents(callback: (event: DeviceNotificationEvent) => void,
        signal: AbortSignal): Promise<() => Promise<void>>;
    startLocationUpdates(callback: (value: DeviceLocation | null, error: Error | null) => void,
        signal: AbortSignal): Promise<() => Promise<void>>;
}
/** Owns device resolvers, Data attributes and native operation cleanup for one page. */
export class DeviceHandler extends Handler {
    constructor(gramlot: Gramlot);
    attach(provider: DeviceProvider, options?: {dispose?: () => void | Promise<void>}): void;
    openDatabase(name: string): Promise<DeviceDatabase>;
    invalidate(name: DeviceName): void;
    refresh(name: DeviceName): void;
    dispose(): void;
}
