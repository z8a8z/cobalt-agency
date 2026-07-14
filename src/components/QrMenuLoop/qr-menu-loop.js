const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
  <div class="qml" role="img" aria-label="Animated QR menu demonstration">
    <div class="qml__ambient" aria-hidden="true"></div>
    <div class="qml__grid" aria-hidden="true"></div>

    <div class="qml__scene qml__scene--table" data-table-scene>
      <div class="qml__back-glow" aria-hidden="true"></div>
      <div class="qml__table-shadow" aria-hidden="true"></div>
      <div class="qml__table" aria-hidden="true">
        <div class="qml__table-edge"></div>
        <div class="qml__table-sheen"></div>
      </div>

      <div class="qml__stand" data-stand aria-hidden="true">
        <div class="qml__stand-halo"></div>
        <div class="qml__stand-panel">
          <div class="qml__stand-shine"></div>
          <div class="qml__qr-shell">
            <div class="qml__qr" data-qr></div>
          </div>
          <div class="qml__stand-dot"></div>
        </div>
        <div class="qml__stand-foot"></div>
      </div>

      <div class="qml__scan-orbit" data-scan-orbit aria-hidden="true">
        <div class="qml__scan-orbit-ring"></div>
        <div class="qml__scan-orbit-ring qml__scan-orbit-ring--two"></div>
      </div>

      <div class="qml__phone" data-phone aria-hidden="true">
        <div class="qml__phone-shadow"></div>
        <div class="qml__phone-body">
          <div class="qml__phone-speaker"></div>
          <div class="qml__phone-screen" data-phone-screen>
            <div class="qml__camera-view" data-camera-view>
              <div class="qml__camera-noise"></div>
              <div class="qml__camera-qr"><div class="qml__qr qml__qr--camera" data-camera-qr></div></div>
              <div class="qml__scan-frame">
                <i></i><i></i><i></i><i></i>
                <div class="qml__scan-line" data-scan-line></div>
              </div>
              <div class="qml__focus-dot"></div>
            </div>
            <div class="qml__phone-menu" data-phone-menu>
              <div class="qml-menu qml-menu--phone" data-menu-blueprint></div>
            </div>
          </div>
          <div class="qml__phone-button"></div>
        </div>
      </div>
    </div>

    <div class="qml__menu-stage" data-menu-stage aria-hidden="true">
      <div class="qml__menu-surface" data-menu-surface>
        <div class="qml-menu qml-menu--full" data-full-menu></div>
      </div>
      <div class="qml__menu-vignette"></div>
    </div>

    <div class="qml__transition-glow" data-transition-glow aria-hidden="true"></div>
  </div>
`;

const STYLE_URL = new URL('./qr-menu-loop.css', import.meta.url);

function menuMarkup() {
  return `
    <div class="qml-menu__inner" data-menu-scroll>
      <div class="qml-menu__topbar">
        <div class="qml-menu__mark"><span></span><span></span></div>
        <div class="qml-menu__utility"><i></i><i></i></div>
      </div>

      <div class="qml-menu__hero">
        <div class="qml-menu__hero-orb qml-menu__hero-orb--one"></div>
        <div class="qml-menu__hero-orb qml-menu__hero-orb--two"></div>
        <div class="qml-menu__hero-cup">
          <div class="qml-menu__cup-top"></div>
          <div class="qml-menu__cup-body"></div>
          <div class="qml-menu__cup-handle"></div>
          <div class="qml-menu__steam"><i></i><i></i><i></i></div>
        </div>
        <div class="qml-menu__hero-lines"><i></i><i></i></div>
      </div>

      <div class="qml-menu__chips">
        <span class="is-active"></span><span></span><span></span><span></span>
      </div>

      <div class="qml-menu__grid-list">
        ${menuCard(0)}
        ${menuCard(1)}
        ${menuCard(2)}
        ${menuCard(3)}
        ${menuCard(4)}
        ${menuCard(5)}
      </div>
    </div>
  `;
}

function menuCard(index) {
  const types = ['cup', 'leaf', 'bean', 'drop', 'cup', 'bean'];
  return `
    <div class="qml-menu__card qml-menu__card--${index + 1}">
      <div class="qml-menu__thumb qml-menu__thumb--${types[index]}">
        <span></span><i></i><b></b>
      </div>
      <div class="qml-menu__card-copy"><i></i><i></i><i></i></div>
      <div class="qml-menu__price-dot"></div>
    </div>
  `;
}

const QR_MATRIX = [
  '1111111010001101101111111',
  '1000001000011100101000001',
  '1011101000011001001011101',
  '1011101011010111001011101',
  '1011101010000011101011101',
  '1000001010011000101000001',
  '1111111010101010101111111',
  '0000000011111011100000000',
  '1000101111111000011111001',
  '1011000011000101100011010',
  '1001111001000101101111100',
  '1000100011100010001000110',
  '0001001100110111011101111',
  '1110100110101011000010010',
  '0010111101111111110111100',
  '0001010011010101011110110',
  '1110101110101100111111100',
  '0000000010000111100010000',
  '1111111010000000101010000',
  '1000001001101010100011110',
  '1011101010110110111111111',
  '1011101000101000011100111',
  '1011101001011110011001010',
  '1000001000010101010111110',
  '1111111010001101011000111'
];

function makeQr(target) {
  target.innerHTML = '';
  target.style.setProperty('--qr-size', QR_MATRIX.length);
  QR_MATRIX.join('').split('').forEach((value) => {
    const cell = document.createElement('i');
    if (value === '1') cell.className = 'is-on';
    target.append(cell);
  });
}

const sleep = (ms, signal) => new Promise((resolve, reject) => {
  const timer = window.setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => {
    window.clearTimeout(timer);
    reject(new DOMException('Animation aborted', 'AbortError'));
  }, { once: true });
});

function animate(el, keyframes, options, signal) {
  if (!el) return Promise.resolve();
  const animation = el.animate(keyframes, { fill: 'both', ...options });
  signal?.addEventListener('abort', () => animation.cancel(), { once: true });
  return animation.finished.catch(() => undefined);
}

class QrMenuLoop extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(TEMPLATE.content.cloneNode(true));

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLE_URL.href;
    this.shadowRoot.prepend(link);
    this.styleReady = new Promise((resolve) => {
      if (link.sheet) {
        resolve();
        return;
      }
      link.addEventListener('load', resolve, { once: true });
      link.addEventListener('error', resolve, { once: true });
      window.setTimeout(resolve, 800);
    });

    this.abortController = null;
    this.resizeObserver = null;
    this.running = false;
    this.isReady = false;
  }

  connectedCallback() {
    this.cacheElements();
    this.fillMenus();
    this.prepareQrCodes();
    this.resetScene();

    this.resizeObserver = new ResizeObserver(() => this.setGeometry());
    this.resizeObserver.observe(this.root);

    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.styleReady.then(() => {
      if (!this.isConnected) return;
      this.isReady = true;
      requestAnimationFrame(() => {
        this.setGeometry();
        this.start();
      });
    });
  }

  disconnectedCallback() {
    this.stop();
    this.resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  onVisibilityChange = () => {
    if (document.hidden) this.stop();
    else this.start();
  };

  cacheElements() {
    const $ = (selector) => this.shadowRoot.querySelector(selector);
    this.root = $('.qml');
    this.tableScene = $('[data-table-scene]');
    this.stand = $('[data-stand]');
    this.scanOrbit = $('[data-scan-orbit]');
    this.phone = $('[data-phone]');
    this.phoneScreen = $('[data-phone-screen]');
    this.cameraView = $('[data-camera-view]');
    this.scanLine = $('[data-scan-line]');
    this.phoneMenu = $('[data-phone-menu]');
    this.menuStage = $('[data-menu-stage]');
    this.menuSurface = $('[data-menu-surface]');
    this.transitionGlow = $('[data-transition-glow]');
  }

  fillMenus() {
    this.shadowRoot.querySelector('[data-menu-blueprint]').innerHTML = menuMarkup();
    this.shadowRoot.querySelector('[data-full-menu]').innerHTML = menuMarkup();
    this.phoneScroll = this.phoneMenu.querySelector('[data-menu-scroll]');
    this.fullScroll = this.menuStage.querySelector('[data-menu-scroll]');
  }

  prepareQrCodes() {
    makeQr(this.shadowRoot.querySelector('[data-qr]'));
    makeQr(this.shadowRoot.querySelector('[data-camera-qr]'));
  }

  setGeometry() {
    if (!this.root?.isConnected) return;
    const stageRect = this.root.getBoundingClientRect();
    const screenRect = this.phoneScreen.getBoundingClientRect();
    const pad = Math.max(8, stageRect.width * 0.018);
    const target = {
      left: stageRect.left + pad,
      top: stageRect.top + pad,
      width: stageRect.width - pad * 2,
      height: stageRect.height - pad * 2,
    };

    this.geometry = {
      x: screenRect.left - target.left,
      y: screenRect.top - target.top,
      scaleX: screenRect.width / target.width,
      scaleY: screenRect.height / target.height,
      phoneRadius: Math.max(18, screenRect.width * 0.115),
      targetRadius: Math.max(16, stageRect.width * 0.024),
    };
  }

  clearAllAnimations() {
    const elements = [
      this.phone,
      this.tableScene,
      this.scanLine,
      this.cameraView,
      this.phoneMenu,
      this.menuSurface,
      this.menuStage,
      this.fullScroll
    ];
    elements.forEach(el => {
      if (el) {
        el.getAnimations().forEach(anim => anim.cancel());
      }
    });
  }

  resetScene() {
    this.clearAllAnimations();

    this.tableScene.style.opacity = '1';
    this.tableScene.style.transform = 'none';
    
    // Phone starts hidden, set up for entry
    this.phone.style.opacity = '0';
    this.phone.style.transform = 'translate3d(55%, 5%, 0) rotate(8deg) scale(.93)';
    
    // Screen starts completely black/empty (both camera and menu are hidden)
    this.cameraView.style.opacity = '0';
    this.phoneMenu.style.opacity = '0';
    
    // Scan line starts hidden at top
    this.scanLine.style.transform = 'translateY(-300%)';
    this.scanLine.style.opacity = '0';
    
    // Full screen menu starts hidden
    this.menuStage.style.opacity = '0';
    this.menuStage.style.pointerEvents = 'none';
    this.menuSurface.style.opacity = '0';
    this.menuSurface.style.transform = 'translate3d(0, 30px, 0)';
    
    // Reset scroll positions
    this.fullScroll.style.transform = 'translate3d(0, 0, 0)';
    this.phoneScroll.style.transform = 'translate3d(0, 0, 0)';
  }

  start() {
    if (!this.isReady || this.running || document.hidden) return;

    this.running = true;
    const controller = new AbortController();
    this.abortController = controller;

    this.runLoop(controller.signal)
      .catch((error) => {
        if (error?.name !== 'AbortError') console.error(error);
      })
      .finally(() => {
        if (this.abortController === controller) {
          this.abortController = null;
          this.running = false;
        }
      });
  }

  stop() {
    this.running = false;
    this.abortController?.abort();
    this.abortController = null;
    this.resetScene();
  }

  async runLoop(signal) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = Number.parseFloat(this.getAttribute('speed') || '1');
    const duration = (ms) => reduced ? Math.min(ms, 180) : ms / Math.max(0.35, speed);
    const easeOut = 'cubic-bezier(.16,1,.3,1)';
    while (!signal.aborted) {
      this.resetScene();

      // ① QR stand waits briefly before a phone scans it.
      await sleep(duration(720), signal);

      // ② Phone enters.
      await animate(this.phone,
        [
          { opacity: 0, transform: 'translate3d(55%, 5%, 0) rotate(8deg) scale(.93)' },
          { opacity: 1, offset: .25 },
          { opacity: 1, transform: 'translate3d(0, 0, 0) rotate(-2deg) scale(1)' }
        ],
        { duration: duration(780), easing: easeOut }, signal);

      await sleep(duration(160), signal);

      // ③ Viewfinder appears and scans once.
      await Promise.all([
        animate(this.cameraView,
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: duration(180), easing: easeOut }, signal),
        animate(this.scanLine,
          [
            { transform: 'translateY(-300%)', opacity: 0 },
            { opacity: 1, offset: .12 },
            { transform: 'translateY(300%)', opacity: 0 }
          ],
          { duration: duration(620), delay: duration(60), easing: easeOut }, signal)
      ]);

      await sleep(duration(80), signal);

      // ④ The menu replaces the viewfinder.
      await Promise.all([
        animate(this.cameraView,
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: duration(280), easing: easeOut }, signal),
        animate(this.phoneMenu,
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: duration(320), easing: easeOut }, signal)
      ]);

      await sleep(duration(480), signal);

      // ⑤ The full menu takes over without auto-scrolling its content.
      this.menuStage.style.opacity = '1';
      this.menuStage.style.pointerEvents = 'none';

      await Promise.all([
        animate(this.menuSurface,
          [
            { opacity: 0, transform: 'translate3d(0, 30px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
          ],
          { duration: duration(600), easing: easeOut }, signal),
        animate(this.tableScene,
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: duration(460), easing: easeOut }, signal)
      ]);

      await sleep(duration(1100), signal);

      // ⑥ A short reset begins the next explanatory cycle.
      await Promise.all([
        animate(this.menuStage,
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: duration(260), easing: easeOut }, signal),
        animate(this.menuSurface,
          [{ opacity: 1, transform: 'translate3d(0, 0, 0)' }, { opacity: 0, transform: 'translate3d(0, -14px, 0)' }],
          { duration: duration(260), easing: easeOut }, signal),
        animate(this.tableScene,
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: duration(300), easing: easeOut }, signal),
        animate(this.phone,
          [{ opacity: 1, transform: 'translate3d(0, 0, 0) rotate(-2deg) scale(1)' }, { opacity: 0, transform: 'translate3d(22%, 4%, 0) rotate(4deg) scale(.96)' }],
          { duration: duration(300), easing: easeOut }, signal)
      ]);

      await sleep(duration(260), signal);
    }
  }
}

if (!customElements.get('qr-menu-loop')) {
  customElements.define('qr-menu-loop', QrMenuLoop);
}
