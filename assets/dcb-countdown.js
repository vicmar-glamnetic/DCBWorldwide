// DCB Drop Countdown — lightweight custom element, no dependencies.
// Reads `data-deadline` (ISO 8601 with offset, e.g. 2026-07-01T18:00:00+08:00)
// and ticks down days/hours/minutes/seconds until it hits zero, then flips
// the host into its expired state by setting the `data-expired` attribute.
class DcbCountdown extends HTMLElement {
  connectedCallback() {
    const raw = this.getAttribute('data-deadline');
    this.deadline = raw ? new Date(raw).getTime() : NaN;

    if (Number.isNaN(this.deadline)) return;

    this.units = {
      days: this.querySelector('[data-unit="days"]'),
      hours: this.querySelector('[data-unit="hours"]'),
      minutes: this.querySelector('[data-unit="minutes"]'),
      seconds: this.querySelector('[data-unit="seconds"]'),
    };

    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  tick() {
    const diff = this.deadline - Date.now();

    if (diff <= 0) {
      clearInterval(this.timer);
      this.setAttribute('data-expired', '');
      this.set('days', 0);
      this.set('hours', 0);
      this.set('minutes', 0);
      this.set('seconds', 0);
      return;
    }

    const sec = Math.floor(diff / 1000);
    this.set('days', Math.floor(sec / 86400));
    this.set('hours', Math.floor((sec % 86400) / 3600));
    this.set('minutes', Math.floor((sec % 3600) / 60));
    this.set('seconds', sec % 60);
  }

  set(unit, value) {
    const el = this.units[unit];
    if (el) el.textContent = String(value).padStart(2, '0');
  }
}

if (!customElements.get('dcb-countdown')) {
  customElements.define('dcb-countdown', DcbCountdown);
}
