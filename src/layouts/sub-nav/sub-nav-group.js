export class CdgSubNavGroup extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-sub-nav-group');
  }
}
