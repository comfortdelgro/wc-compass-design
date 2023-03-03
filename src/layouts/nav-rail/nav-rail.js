export class CdgNavRail extends HTMLElement {
  container;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-nav-rail');
    this.container = document.createElement('div');
    this.container.classList.add('cdg-nav-rail-inner');
    this.container.innerHTML = this.innerHTML;

    // Clear all
    this.textContent = '';
    this.appendChild(this.container);
  }
}
