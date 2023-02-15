export class CdgIconSize extends HTMLElement {
  constructor() {
    super();

    this.addCustomSize();
  }

  addCustomSize() {
    if (this.hasAttribute('size')) {
      const size = this.getAttribute('size');
      this.style.width = size + 'px';
      this.style.height = size + 'px';
      this.style.fontSize = size * 0.333334 + 'px';
    }
  }
}
