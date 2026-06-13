// DCB count-up — animates a number from 0 to its target the first time
// it scrolls into view. Reduced-motion users see the final value instantly.
class DcbCountup extends HTMLElement {
  connectedCallback() {
    this.numEl = this.querySelector('[data-countup]');
    this.target = parseFloat(this.getAttribute('data-target')) || 0;
    this.duration = parseInt(this.getAttribute('data-duration'), 10) || 1600;
    this.decimals = parseInt(this.getAttribute('data-decimals'), 10) || 0;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      this.render(this.target);
      return;
    }

    this.render(0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.run();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(this);
  }

  run() {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / this.duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      this.render(this.target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  render(value) {
    if (!this.numEl) return;
    this.numEl.textContent = Number(value).toLocaleString(undefined, {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals,
    });
  }
}

if (!customElements.get('dcb-countup')) {
  customElements.define('dcb-countup', DcbCountup);
}
