export class CdgCarouselScroller extends HTMLElement {
  static get observedAttributes() {
    return ['current', 'position'];
  }

  get current() {
    return Number(this.getAttribute('current')) || 0;
  }

  set current(current) {
    this.setAttribute('current', current);
  }

  get position() {
    return Number(this.getAttribute('position')) || 0;
  }

  set position(position) {
    this.setAttribute('position', position);
  }

  sizingTimer;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-carousel-scroller');
    this.listenEvents();
    this.updateViewResize();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.updateViewResize.bind(this));
  }

  attributeChangedCallback(attr) {
    switch (attr) {
      case 'current':
        this.position = this.parentElement.clientWidth * this.current;
        this.updatePosition();
        this.dispatchEvent(
          new CustomEvent('updatePosition', { detail: this.position })
        );
        break;

      case 'position':
        this.updatePosition();
        break;

      default:
        break;
    }
  }

  listenEvents() {
    window.addEventListener('resize', this.updateViewResize.bind(this));
  }

  updateViewResize() {
    // To add resizing class name
    // Prevent animation while resizing
    // To update view immediately
    this.classList.add('resizing');
    if (this.sizingTimer) {
      clearTimeout(this.sizingTimer);
    }

    // Remove class name after 200ms that use haven't resized again
    this.sizingTimer = setTimeout(() => {
      this.classList.remove('resizing');
    }, 200);

    this.style.width =
      this.parentElement.clientWidth * this.children.length + 'px';

    this.parentElement.clientWidth * this.current;
    this.updatePosition();
  }

  updatePosition() {
    this.style.transform = `translate3d(-${this.position}px, 0, 0)`;
  }
}
