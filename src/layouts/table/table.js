import './styles.scss'

export class CdgTable extends HTMLElement {
  constructor() {
    super();
    // const table = document.createElement('table');
    // this.appendChild(table);
    this.setAttribute('role','table')
  }
  // connectedCallback() {
  //   this.classList.add('cdg-talbe-badge');
  // }
}
