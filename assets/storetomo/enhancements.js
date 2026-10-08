/* Progressive enhancement for the static STORETOMO sales site. Footer is excluded. */
(function () {
  'use strict';
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  var activeViewer = null;
  var pendingViewer = false;
  var viewerModule = null;
  var motionContext = null;
  var routeFrame = null;

  function visiblePage() {
    return Array.from(document.querySelectorAll('main')).find(function (main) { return !main.hidden; });
  }

  function setupMotion() {
    if (motionContext) { motionContext.revert(); motionContext = null; }
    if (motion.matches || !window.gsap || !window.ScrollTrigger) return;
    var page = visiblePage();
    if (!page || !page.matches('.concept-home, .concept-product')) return;
    gsap.registerPlugin(ScrollTrigger);
    motionContext = gsap.context(function (context) {
      context.add('reveal', function (target) {
        gsap.fromTo(target, { opacity: 0.88, y: 18 }, {
          opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
          immediateRender: false, clearProps: 'opacity,transform'
        });
      });
      page.querySelectorAll('.hero-copy, .hero-art, .impact-grid, .demo-card, .showcase-grid, .pricing-section article, .faq-intro, #pp-sc .ksc').forEach(function (target) {
        var rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        // Content stays visible before enhancement and after any interrupted transition.
        if (rect.top < innerHeight && rect.bottom > 0) context.reveal(target);
        else ScrollTrigger.create({ trigger: target, start: 'top 92%', once: true, onEnter: function () { context.reveal(target); } });
      });
    }, page);
  }

  function imageData(src, alt, image) {
    if (image && image.complete && image.naturalWidth) return Promise.resolve({ src: src, width: image.naturalWidth, height: image.naturalHeight, alt: alt });
    return new Promise(function (resolve, reject) {
      var probe = new Image();
      probe.onload = function () { resolve({ src: src, width: probe.naturalWidth, height: probe.naturalHeight, alt: alt }); };
      probe.onerror = reject;
      probe.src = src;
    });
  }

  function galleryItems(src, alt, trigger) {
    var candidates = [];
    var page = trigger.closest('main');
    if (trigger.id === 'visual-image') {
      GALLERY.forEach(function (item) { candidates.push({ src: VISUALS[item.k], alt: item.alt }); });
    } else if (page) {
      page.querySelectorAll('[data-capture-zoom]').forEach(function (button) {
        var image = button.querySelector('img');
        candidates.push({ src: VISUALS[button.dataset.captureZoom], alt: image ? image.alt : button.getAttribute('aria-label'), image: image });
      });
    }
    if (!candidates.some(function (item) { return item.src === src; })) candidates.unshift({ src: src, alt: alt });
    var seen = new Set();
    return candidates.filter(function (item) { if (!item.src || seen.has(item.src)) return false; seen.add(item.src); return true; });
  }

  // Core is imported only when an image is opened; the original dialog is the fallback.
  window.STORETOMO_VIEWER = async function (src, alt, trigger, fallback) {
    if (pendingViewer || activeViewer) return;
    pendingViewer = true;
    var routeAtOpen = location.hash;
    trigger.setAttribute('aria-busy', 'true');
    try {
      if (!viewerModule) viewerModule = import('./vendor/photoswipe-5.4.4/photoswipe.esm.min.js');
      var candidates = galleryItems(src, alt, trigger);
      var result = await Promise.all([
        viewerModule,
        Promise.all(candidates.map(function (item) { return imageData(item.src, item.alt, item.image); }))
      ]);
      if (routeAtOpen !== location.hash || !trigger.isConnected) return;
      var items = result[1];
      var viewer = new result[0].default({
        dataSource: items, index: Math.max(0, items.findIndex(function (item) { return item.src === src; })),
        bgOpacity: 0.96, loop: false, showHideAnimationType: 'fade',
        showAnimationDuration: motion.matches ? 0 : 180, hideAnimationDuration: motion.matches ? 0 : 150,
        zoomAnimationDuration: motion.matches ? 0 : 200,
        closeTitle: 'Close image viewer', zoomTitle: 'Zoom image',
        arrowPrevTitle: 'Previous capture', arrowNextTitle: 'Next capture',
        imageClickAction: 'zoom', tapAction: 'toggle-controls', doubleTapAction: 'zoom',
        returnFocus: true, initialZoomLevel: 'fit', secondaryZoomLevel: 1
      });
      activeViewer = viewer;
      viewer.on('uiRegister', function () {
        viewer.ui.registerElement({ name: 'capture-caption', order: 9, isButton: false, appendTo: 'root',
          onInit: function (element) {
            function updateCaption() { element.textContent = 'RUSHFIELD · ' + viewer.currSlide.data.alt; }
            viewer.on('change', updateCaption);
          }
        });
      });
      viewer.on('afterInit', function () { viewer.element.setAttribute('aria-label', 'RUSHFIELD storefront captures'); });
      viewer.on('destroy', function () { activeViewer = null; });
      viewer.init();
    } catch (error) {
      viewerModule = null;
      if (activeViewer) { activeViewer.destroy(); activeViewer = null; }
      if (routeAtOpen === location.hash && trigger.isConnected) fallback();
    } finally {
      pendingViewer = false;
      trigger.removeAttribute('aria-busy');
    }
  };

  window.addEventListener('hashchange', function () {
    if (activeViewer) activeViewer.close();
    cancelAnimationFrame(routeFrame);
    routeFrame = requestAnimationFrame(setupMotion);
  });
  motion.addEventListener('change', setupMotion);
  setupMotion();
})();
