# STORETOMO website

The current STORETOMO theme sales website, including the landing page, Pro product detail, feature captures, demo cart and checkout preview.

## Stack

- HTML, CSS and vanilla JavaScript. No React or Next.js yet.
- GSAP and ScrollTrigger 3.15.0 for scoped entrance animations.
- PhotoSwipe 5.4.4 for capture galleries and zoom; its core loads on demand.
- Poppins is loaded through Google Fonts.

All required image data is embedded in `index.html`. Libraries and enhancement code are served from `assets/storetomo/`; keep that directory beside the HTML file.

## Run locally

Python 3 is sufficient; no npm install or build step is needed.

```sh
python3 -m http.server 4194 --bind 127.0.0.1
```

Open http://127.0.0.1:4194/ . Pro detail uses `#/product`. Stop the server with Ctrl+C.

## Files

- `index.html`: current approved UI and application behavior.
- `assets/storetomo/enhancements.js`: motion and PhotoSwipe integration, reduced motion and native-dialog fallback.
- `assets/storetomo/enhancements.css`: scoped viewer styling.
- `assets/storetomo/vendor/manifest.json`: pinned versions, package provenance and SHA-512 integrity.

The approved footer, payment icons and wave animation are preserved in the HTML.

## Current scope

This is the static sales frontend. The separate Shopify Liquid theme is not included. Cart and checkout are previews; no real payment is processed. License terms, customer review data and production payment integration still require configuration. Analytics imagery and review previews are labelled as illustrative/sample content.

## Licensing

Application source is proprietary. Third-party dependencies retain their original notices: PhotoSwipe uses MIT; GSAP and ScrollTrigger use the GSAP standard license. See the files under `assets/storetomo/vendor/`.
