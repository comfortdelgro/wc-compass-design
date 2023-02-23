export class CdgDropdownOption extends HTMLElement {
  static get observedAttributes() {
    return ['selected'];
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

      default:
        break;
    }
  }
}
