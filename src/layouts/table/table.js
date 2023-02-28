import './styles.scss'

export class CdgTable extends HTMLElement {
  constructor() {
    super();
    this.setAttribute('role','table')
  }
  connectedCallback() {
    this.classList.add('cdg-talbe');
  }
}
