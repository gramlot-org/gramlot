# Browser and device icons

`app-icon.svg` and `favicon.svg` use the shared vector symbol on a navy rounded
square. ICO contains 16, 24, 32, 48 and 64 pixel images. PNG exports include those
sizes plus Apple touch (180), Android (192/512) and opaque maskable icons (192/512).
`mask-icon.svg` is a black silhouette for Safari pinned tabs. Maskable artwork
stays within the central safe circle, radius 40% of the square canvas.

The approved mark has thin tips: inspect 16/24 pixel output on the target browser.
These exports do not establish certified minimum sizes or platform approval.

Copy the needed files into the application's static directory and adapt URLs:

```html
<link rel="icon" href="/branding/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/branding/icons/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/branding/icons/apple-touch-icon.png">
<link rel="mask-icon" href="/branding/icons/mask-icon.svg" color="#456BC4">
<link rel="manifest" href="/branding/icons/site.webmanifest">
<meta name="theme-color" content="#182333">
```

`site.webmanifest` is an icon metadata fragment. Its relative URLs resolve next
to the manifest. Add the application's own `start_url`, scope and display settings
when integrating it; the kit does not define navigation or PWA installation behavior.
