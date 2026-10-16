(() => {
  const root = document.querySelector('[data-aura-product]');
  if (!root) return;

  const stage = root.querySelector('[data-aura-stage]');
  const thumbs = root.querySelectorAll('[data-aura-thumb]');
  const stageImg = root.querySelector('[data-aura-stage-img]');
  const stageVideo = root.querySelector('[data-aura-stage-video]');

  const setActiveThumb = (id) => {
    thumbs.forEach((thumb) => {
      const active = thumb.dataset.auraThumb === String(id);
      thumb.classList.toggle('is-active', active);
      thumb.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const showMedia = (mediaId) => {
    if (!stage) return;
    const slides = stage.querySelectorAll('[data-aura-slide]');
    let found = false;
    slides.forEach((slide) => {
      const match = slide.dataset.auraSlide === String(mediaId);
      slide.hidden = !match;
      if (match) found = true;
    });
    if (!found && slides[0]) {
      slides[0].hidden = false;
      setActiveThumb(slides[0].dataset.auraSlide);
      return;
    }
    setActiveThumb(mediaId);
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => showMedia(thumb.dataset.auraThumb));
  });

  root.querySelectorAll('[data-aura-accordion]').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      root.querySelectorAll('[data-aura-accordion]').forEach((other) => {
        if (other !== details) other.open = false;
      });
    });
  });

  const applyVariantMedia = (variant) => {
    if (!variant || !variant.featured_media) return;
    showMedia(variant.featured_media.id);
  };

  if (window.subscribe && window.PUB_SUB_EVENTS) {
    window.subscribe(window.PUB_SUB_EVENTS.variantChange, (event) => {
      applyVariantMedia(event?.data?.variant);
    });
  }

  // Fallback: watch variant radios for stores without pub/sub timing
  const radios = root.querySelector('variant-radios');
  if (radios) {
    radios.addEventListener('change', () => {
      const variant = radios.currentVariant;
      applyVariantMedia(variant);
    });
  }

  // Soft reveal
  requestAnimationFrame(() => root.classList.add('is-ready'));
})();
