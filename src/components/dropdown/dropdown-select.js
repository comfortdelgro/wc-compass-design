export class CdgDropdownSelect extends HTMLElement {
  floatingElement;

  static get observedAttributes() {
    return ['opening', 'width'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown-select');
    this.createFloating();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    console.log('attributeChangedCallback: ', attr, oldValue, newValue);
    if (attr === 'width' && oldValue !== newValue) {
      this.createFloating();
      if (this.floatingElement) {
        this.floatingElement.setAttribute('width', newValue);
      }
    }
    if (attr === 'opening' && oldValue !== newValue) {
      this.floatingElement.setAttribute('opening', newValue);
      this.style.display = newValue ? 'block' : 'none';
    }
  }

  createFloating() {
    if (!this.floatingElement) {
      this.floatingElement = document.createElement('cdg-floating-content');
      this.floatingElement.innerHTML = this.innerHTML;
      this.innerHTML = null;
      this.append(this.floatingElement);
    }
  }
}
