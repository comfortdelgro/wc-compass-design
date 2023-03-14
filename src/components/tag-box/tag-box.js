export class CdgTagBoxContainer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-tag-box-container');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attr] = newValue;
  }
}
