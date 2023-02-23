export class CdgCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-card');
    this.classList.add('raised');
    // Make card focusable
    this.tabIndex = 0;
  }
}
