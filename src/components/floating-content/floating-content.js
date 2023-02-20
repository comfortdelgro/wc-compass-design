const template = document.createElement('template');
template.innerHTML = `
    <div class="cdg-floating-content"></div>
`;

export class CdgFloatingContent extends HTMLElement {
  static get observedAttributes() {
    return ['opening', 'width'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-floating-content');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'width' && oldValue !== newValue) {
      this.style.width = newValue;
    }
    if (attr === 'opening' && oldValue !== newValue) {
      if (newValue) {
        this.style.visibility = 'visible';
        this.style.opacity = '1';
      } else {
        this.style.visibility = 'hidden';
        this.style.opacity = '0';
      }
    }
  }
}
