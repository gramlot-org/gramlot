# PORT-0024-mobile-gallery

- **Status:** implemented; destination verification recorded in GC-070-2040; owner acceptance pending.
- **Evidence:** GCP-110 §035 and GCP-120, 2026-10-25; connected device-push core working tree and separate mobile_application module.
- **Constitution:** explicit mobile-gallery integration amendment, §13 primary path, §14 dependency boundaries.

## Scope and contract

Selective DeviceHandler/resolver, DeviceFrameHost/FrameDeviceProvider,
MobileEnvironment, transformPane, approved navigation helper and Mela/button
contrast changes. Preserve the destination gallery and its examples. Native
provider and mobile pages remain in gramlot-capacitor; public hosting belongs to
the Python adapter; catalogue presentation belongs to gramlot-examples.
No Builder/Bag edit or generic native method dispatcher. No production APNs,
private configuration, release, deployment or TestFlight upload.

## Destination review

The prior prototype's unconditional provider import is rejected: ordinary browser
and editor tests must not load the native resource. The receiver instead loads a
trusted same-origin module only in native Capacitor, and disposes it with Source.
Updated Mela needed a bounded toolbar-padding adjustment: mobile field padding
compressed 24px toolbar icons. Gallery rail dimensions now honor theme/touch minima.
A separately copied public artifact, not the private project root, drives the
local Uvicorn acceptance run. Missing host prerequisites omit page routes.

## Verification and limits

Core: 3945 JS tests passed; Python 273 passed, one expected failure and 382
passing subtests. Tests include device message origin, frame ownership, cancellation,
cleanup, mobile environment and transform behavior. Gallery/host regressions cover
registry validation, no web import, direct iframe selection, disposal during
script load, exact-origin theme messages and preserved Data. Full current
receiver evidence and remaining hardware/deployment checks: GC-070-2040.
Native hardware and off-LAN public service acceptance are pending. Working code
and passing tests do not constitute owner acceptance.

## Feedback for later ports

Rebuild embedded gallery themes as well as served CSS. Check controls against
mobile minimum sizes, not only desktop tokens. Serve the external catalogue
itself and verify its URL. Keep deployment readiness distinct from local preview.
