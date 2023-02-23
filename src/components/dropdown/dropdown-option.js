export class CdgDropdownOption extends HTMLElement {
  static get observedAttributes() {
    return ['selected', 'current-color'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown-option');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attr) {
      case 'selected':
        if (newValue) {
          this.classList.add('cdg-dropdown-option-selected');
        } else {
          this.classList.remove('cdg-dropdown-option-selected');
        }
        break;
      case 'current-color':
        if (newValue) {
          this.classList.add('cdg-dropdown-option-flex');
          const color = document.createElement('div');
          color.classList.add('cdg-dropdown-option-color');
          color.style.backgroundColor = newValue;
          this.appendChild(color);
        }
        break;

      default:
        break;
    }
  }
}
