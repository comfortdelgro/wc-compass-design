export class CdgTableHeaderCell extends HTMLElement {
  constructor() {
    super();
    this.setAttribute('role','th')
  }
  connectedCallback() {
    this.classList.add('cdg-talbe-header-cell');
  }
}

