import { createFloating } from '../floating-content/floating-content';

const templateClearOption = document.createElement('template');
templateClearOption.innerHTML = `
    <cdg-dropdown-option class="cdg-dropdown-option-clear-item"></cdg-dropdown-option>
`;

export class CdgDropdownSelect extends HTMLElement {
  floatingElement;

  static get observedAttributes() {
    return ['opening'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown-select');
    if (!this.floatingElement) {
      this.floatingElement = createFloating.bind(this)(this.parentNode, true);
    }
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'opening' && oldValue !== newValue) {
      if (newValue) {
        if (this.floatingElement) {
          this.floatingElement.setAttribute('opening', 'true');
        }
      } else {
        if (this.floatingElement) {
          this.floatingElement.removeAttribute('opening');
        }
      }
    }
  }
}
