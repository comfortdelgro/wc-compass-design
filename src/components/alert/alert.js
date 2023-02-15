export class CdgAlert extends HTMLElement {
  type = 'info';
  alignment = 'start';
  icon;
  constructor() {
    super();
    this.classList.add('cdg-alert');
  }
}
