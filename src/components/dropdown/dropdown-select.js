const templateClearOption = document.createElement('template');
templateClearOption.innerHTML = `
    <cdg-dropdown-option class="cdg-dropdown-option-clear-item"></cdg-dropdown-option>
`;

export class CdgDropdownSelect extends HTMLElement {
  floatingElement;

  static get observedAttributes() {
    return ['opening', 'width', 'hasClearItem'];
  }

  constructor() {
    super();
    this.createFloating();
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown-select');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'width' && oldValue !== newValue) {
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
