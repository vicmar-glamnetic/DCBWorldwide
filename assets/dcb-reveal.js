// DCB scroll reveal — splits each line into words and staggers a
// fade/rise the first time the element scrolls into view. Decorative:
// the text stays in the DOM, and reduced-motion users get it instantly.
class DcbReveal extends HTMLElement {
  connectedCallback() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = this.querySelectorAll('[data-reveal-text]');

    if (reduce || !('IntersectionObserver' in window)) {
      this.setAttribute('data-revealed', '');
      return;
    }

    let wordIndex = 0;
    lines.forEach((line) => {
      const words = line.textContent.trim().split(/\s+/);
      line.textContent = '';
      words.forEach((word) => {
        const span = document.createElement('span');
        span.className = 'dcb-reveal__word';
        span.style.transitionDelay = (wordIndex * 0.045) + 's';
        span.textContent = word;
        line.append(span, document.createTextNode(' '));
        wordIndex += 1;
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.setAttribute('data-revealed', '');
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(this);
  }
}

if (!customElements.get('dcb-reveal')) {
  customElements.define('dcb-reveal', DcbReveal);
}
