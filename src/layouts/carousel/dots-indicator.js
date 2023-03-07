export class CdgDotsIndicator extends HTMLElement {
  static get observedAttributes() {
    return ['current'];
  }

  get current() {
    return Number(this.getAttribute('current')) || 0;
  }

  set current(current) {
    this.setAttribute('current', current);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-dots-indicator');
  }

  attributeChangedCallback(attr) {
    if (attr === 'current') {
      console.log('Current is changing inside dot indicator', this.current);
    }
  }
}
