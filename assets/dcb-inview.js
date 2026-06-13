// DCB in-view reveal — fades/rises homepage sections as they enter the
// viewport. Progressive enhancement: the hidden initial state is gated on
// the `.dcb-motion` class this script adds, so if JS fails or is disabled,
// or the user prefers reduced motion, all content shows normally.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('dcb-motion');

  const start = () => {
    const sections = document.querySelectorAll(
      '.template-index #MainContent > .shopify-section:not(:first-child)'
    );
    if (!sections.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    sections.forEach((section) => io.observe(section));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
