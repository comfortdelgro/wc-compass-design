export class CdgDropdownOption extends HTMLElement {

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown-option');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    // if (attr === 'opening' && oldValue !== newValue) {
    //   this.floatingElement.setAttribute('opening', newValue);
    //   this.style.display = newValue ? 'block' : 'none';
    // }
  }
}
