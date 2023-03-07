export class CdgCarousel extends HTMLElement {
  container;
  scroller;

  static get observedAttributes() {
    return ['current'];
  }

  get current() {
    return Number(this.getAttribute('current')) || 0;
  }

  set current(current) {
    this.setAttribute('current', current);
  }

  get length() {
    return this.scroller.children.length;
  }

  timer;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-carousel');
    this.wrapContent();
    this.autoPlay();
  }

  wrapContent() {
    this.container = document.createElement('div');
    this.container.classList.add('cdg-carousel-container');

    this.scroller = document.createElement('cdg-carousel-scroller');

    this.scroller.innerHTML = this.innerHTML;
    this.container.appendChild(this.scroller);
    this.textContent = '';

    this.appendChild(this.container);
  }

  attributeChangedCallback(attr) {
    if (attr === 'current') {
      this.scroller.current = this.current;
    }
  }

  autoPlay() {
    this.timer = setTimeout(() => {
      this.current = (this.current + 1) % this.length;
      this.autoPlay();
    }, 3000);
  }

  stop() {
    clearTimeout(this.timer);
  }
}
