const ARROW_RIGHT = `<cdg-icon name="arrowRight" size="32"></cdg-icon>`;
const ARROW_LEFT = `<cdg-icon name="arrowLeft" size="32"></cdg-icon>`;
const ARROW_RIGHT_TEXT = `Next`;
const ARROW_LEFT_TEXT = `Prev`;

export class CdgCarousel extends HTMLElement {
  static get observedAttributes() {
    return ['current', 'useArrow'];
  }

  get current() {
    return Number(this.getAttribute('current')) || 0;
  }

  set current(current) {
    this.setAttribute('current', current);
  }

  get useArrow() {
    return this.getAttribute('useArrow') === 'true';
  }

  set useArrow(useArrow) {
    this.setAttribute('useArrow', useArrow);
  }

  get length() {
    return this.scroller.children.length;
  }

  container;
  scroller;
  controller;
  indicator;
  timer;
  navigationBar;
  btnNext;
  btnPrev;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-carousel');
    this.wrapContent();
    if (!this.hasAttribute('current')) {
      this.autoPlay();
    }
  }

  wrapContent() {
    this.container = document.createElement('div');
    this.container.classList.add('cdg-carousel-container');

    this.scroller = document.createElement('cdg-carousel-scroller');

    this.indicator = document.createElement('cdg-dots-indicator');
    this.indicator.addEventListener('dotClick', this.handleDotClick.bind(this));

    // Element that contains dot, socials
    this.controller = document.createElement('div');
    this.controller.classList.add('cdg-carousel-controllers');

    this.scroller.innerHTML = this.innerHTML;
    this.indicator.length = this.length;
    this.indicator.current = this.current;

    this.controller.appendChild(this.indicator);
    this.container.appendChild(this.scroller);
    this.container.appendChild(this.controller);

    this.textContent = '';

    this.appendChild(this.container);

    // Init first state of scroller
    this.scroller.current = this.current;

    this.attachNavigation();
    this.listenEvents();
  }

  listenEvents() {
    this.addEventListener('pointerdown', this.handlePointerDown.bind(this));
  }

  createButton() {
    const button = document.createElement('button');
    button.setAttribute('size', 'large');
    button.classList.add('cdg-button');
    button.classList.add('ghost');
    button.classList.add(this.useArrow ? 'icon' : 'text');

    return button;
  }

  attachNavigation() {
    this.navigationBar = document.createElement('div');
    this.navigationBar.classList.add('cdg-carousel-navigation');

    this.btnNext = this.createButton();
    this.btnNext.classList.add('next');
    this.btnNext.innerHTML = this.useArrow ? ARROW_RIGHT : ARROW_RIGHT_TEXT;
    this.btnNext.addEventListener('click', this.next.bind(this));

    this.btnPrev = this.createButton();
    this.btnPrev.classList.add('prev');
    this.btnPrev.innerHTML = this.useArrow ? ARROW_LEFT : ARROW_LEFT_TEXT;
    this.btnPrev.addEventListener('click', this.prev.bind(this));

    this.navigationBar.appendChild(this.btnPrev);
    this.navigationBar.appendChild(this.btnNext);
    this.container.appendChild(this.navigationBar);
  }

  attributeChangedCallback(attr) {
    if (attr === 'current') {
      this.scroller.current = this.current;
      this.indicator.current = this.current;
      this.autoPlay();
    }
  }

  autoPlay() {
    this.stop();
    this.timer = setTimeout(() => {
      this.current = (this.current + 1) % this.length;
      this.autoPlay();
    }, 3000);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  next() {
    this.stop();
    this.current = (this.current + 1) % this.length;
  }

  prev() {
    this.stop();
    this.current = (this.length + (this.current - 1)) % this.length;
  }

  handleDotClick(event) {
    const target = event.detail || 0;
    this.stop();
    this.current = target;
  }

  handlePointerDown(event) {
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.handlePointerMove);
    this.addEventListener('pointerup', this.handlePointerUp, {
      once: true,
    });
    this.addEventListener('pointercancel', this.handlePointerUp, {
      once: true,
    });
  }

  handlePointerMove() {
    console.log('pointermove');
  }

  handlePointerUp() {
    this.removeEventListener('pointermove', this.handlePointerMove);
  }
}
