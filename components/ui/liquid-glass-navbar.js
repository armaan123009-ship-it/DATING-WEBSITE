// ============================================================================
// CRAZY LOVE - LIQUID GLASS HIGH-FIDELITY NAVBAR
// Fluid gooey meniscus, specular sheen, and animated NimbusIcons
// ============================================================================

export const NimbusIcons = {
  home: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nimbus-icon nimbus-home">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  `,
  globe: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nimbus-icon nimbus-globe">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  `,
  plane: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nimbus-icon nimbus-plane">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `,
  camera: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nimbus-icon nimbus-camera">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  `,
  drop: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nimbus-icon nimbus-drop">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `,
  user: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nimbus-icon nimbus-user">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `
};

export class LiquidNavbar {
  constructor(options = {}) {
    this.target = options.target || document.body;
    this.tone = options.tone || 'light';
    this.defaultActive = options.defaultActive !== undefined ? options.defaultActive : 0;
    this.sound = Boolean(options.sound);
    this.items = options.items || [
      { label: "Home", icon: NimbusIcons.home, fx: "glow" },
      { label: "Explore", icon: NimbusIcons.globe, fx: "spin" },
      { label: "Discover", icon: NimbusIcons.plane, fx: "plane" },
      { label: "Chats", icon: NimbusIcons.drop, fx: "drop" },
      { label: "Profile", icon: NimbusIcons.user, fx: "wave" },
    ];
    this.onChange = options.onChange || (() => {});
    this.activeIndex = this.defaultActive;
    this.hoverIndex = null;

    this.initAudio();
    this.render();
    this.bindEvents();
  }

  initAudio() {
    if (!this.sound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    } catch (e) {}
  }

  playPopSound() {
    if (!this.sound || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  render() {
    this.container = document.createElement('nav');
    this.container.className = `liquid-navbar-wrapper tone-${this.tone}`;
    this.container.setAttribute('aria-label', 'Liquid Glass Navigation');

    this.container.innerHTML = `
      <!-- SVG Filter for Liquid Gooey Physics -->
      <svg class="liquid-goo-filter" aria-hidden="true" style="position: absolute; width: 0; height: 0; pointer-events: none;">
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      <!-- Glass Shell -->
      <div class="liquid-glass-capsule">
        <!-- Specular Highlight Overlay -->
        <div class="liquid-specular-sheen"></div>

        <!-- Gooey Fluid Meniscus Indicator -->
        <div class="liquid-meniscus-pill" id="liquidMeniscusPill"></div>

        <!-- Nav Items -->
        <div class="liquid-items-track">
          ${this.items.map((item, idx) => `
            <button class="liquid-nav-btn ${idx === this.activeIndex ? 'active' : ''} fx-${item.fx || 'glow'}" data-index="${idx}" type="button">
              <span class="liquid-icon-wrap">${item.icon}</span>
              <span class="liquid-label">${item.label}</span>
              <span class="liquid-ripple-drop"></span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.target.appendChild(this.container);
    this.meniscusEl = this.container.querySelector('#liquidMeniscusPill');
    this.buttons = this.container.querySelectorAll('.liquid-nav-btn');

    // Initial position update after rendering
    setTimeout(() => this.updateMeniscusPosition(), 50);
  }

  bindEvents() {
    this.buttons.forEach((btn, idx) => {
      // Hover event for fluid elastic stretch
      btn.addEventListener('mouseenter', () => {
        this.hoverIndex = idx;
        this.updateMeniscusPosition(idx);
      });

      // Mouse leave reverts to active item
      btn.addEventListener('mouseleave', () => {
        this.hoverIndex = null;
        this.updateMeniscusPosition(this.activeIndex);
      });

      // Click to activate and trigger ripple
      btn.addEventListener('click', (e) => {
        this.setActive(idx);
        this.createRipple(btn, e);
        this.playPopSound();
      });
    });

    window.addEventListener('resize', () => this.updateMeniscusPosition());
  }

  createRipple(btn, e) {
    const ripple = btn.querySelector('.liquid-ripple-drop');
    if (!ripple) return;
    ripple.classList.remove('animate-ripple');
    void ripple.offsetWidth; // Trigger reflow
    ripple.classList.add('animate-ripple');
  }

  updateMeniscusPosition(targetIndex = this.activeIndex) {
    const targetBtn = this.buttons[targetIndex];
    if (!targetBtn || !this.meniscusEl) return;

    const btnRect = targetBtn.getBoundingClientRect();
    const capsuleRect = this.container.querySelector('.liquid-glass-capsule').getBoundingClientRect();

    const left = btnRect.left - capsuleRect.left;
    const width = btnRect.width;

    this.meniscusEl.style.transform = `translate3d(${left}px, 0, 0)`;
    this.meniscusEl.style.width = `${width}px`;
  }

  setActive(index) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;

    this.buttons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });

    this.updateMeniscusPosition(index);
    this.onChange(index, this.items[index]);
  }

  setTone(tone) {
    if (this.tone === tone) return;
    this.container.classList.remove(`tone-${this.tone}`);
    this.tone = tone;
    this.container.classList.add(`tone-${this.tone}`);
    this.updateMeniscusPosition();
  }
}

