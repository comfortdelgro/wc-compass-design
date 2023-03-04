import { CdgIconSize } from '../../shared/core.js';

export class CdgAvatar extends CdgIconSize {
  static get observedAttributes() {
    return ['size', 'name'];
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(name) {
    this.setAttribute('name', name);
  }

  get size() {
    return Number(this.getAttribute('size'));
  }

  set size(size) {
    this.setAttribute('size', size);
  }

  get useFullName() {
    return this.hasAttribute('useFullName');
  }

  nameElement;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-avatar');

    const type = this.getAttribute('type');
    if (!type || type !== 'icon') {
      this.attachShadow({ mode: 'open' }); // sets and returns 'this.shadowRoot'
    }

    if (this.hasAttribute('imageSrc')) {
      this.displayAsImage();
    } else if (this.name) {
      this.displayAsLetters();
    }
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'size') {
      this.addCustomSize();
    } else if (attr === 'name') {
      if (this.nameElement && !this.hasAttribute('imageSrc')) {
        this.nameElement.textContent = this.useFullName
          ? this.name
          : this.getShortName(this.name);
      }
    }
  }

  displayAsImage() {
    // Create some CSS to apply to the shadow DOM
    const style = document.createElement('style');
    style.textContent = `
        .avatar-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    `;

    const img = document.createElement('img');
    img.classList.add('avatar-image');
    img.src = this.getAttribute('imageSrc');
    img.alt = this.hasAttribute('alt')
      ? this.getAttribute('alt')
      : 'Avatar image';
    this.shadowRoot.append(style, img);
  }

  displayAsLetters() {
    // Create some CSS to apply to the shadow DOM
    const style = document.createElement('style');
    style.textContent = `
    .avatar-text {
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    `;

    const text = this.useFullName ? this.name : this.getShortName(this.name);

    this.nameElement = document.createElement('span');
    this.nameElement.classList.add('avatar-text');
    this.nameElement.textContent = text;
    this.nameElement.alt = this.hasAttribute('alt')
      ? this.getAttribute('alt')
      : 'Avatar image';

    this.shadowRoot.append(style, this.nameElement);
  }

  getShortName(name) {
    if (!name) {
      return '';
    }

    const splited = name.split(' ');
    const firstChar = splited[0][0];
    let lastChar = '';
    if (splited.length > 1) {
      lastChar = splited[splited.length - 1][0];
    }
    return firstChar + lastChar;
  }
}
