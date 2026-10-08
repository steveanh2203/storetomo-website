# STORETOMO UI dependencies

GSAP + ScrollTrigger 3.15.0: scoped entrance animations for the visible landing or Pro page. Contexts are cleaned up on hash navigation and reduced-motion changes. The footer and native scrolling are excluded.

PhotoSwipe 5.4.4: genuine Shopify captures, multi-image navigation, zoom, swipe, keyboard dismissal and focus return. Core is dynamically imported on first open. The existing native dialog remains the fallback if import fails.

Pinned npm tarballs were verified against npm SHA-512 integrity. See vendor/manifest.json. Original vendor license notices are retained.

Serve this entire assets/storetomo directory beside index.html. No framework build or runtime CDN is required. JavaScript and stylesheet paths are relative.
