export class CdgTagBoxItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-tag-box-item');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attr] = newValue;
  }
}
