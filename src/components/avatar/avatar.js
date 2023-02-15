import { CdgIconSize } from '../../shared/core.js';

export class CdgAvatar extends CdgIconSize {
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
    } else if (this.hasAttribute('name')) {
      this.displayAsLetters();
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

    const text = this.getShortName(this.getAttribute('name'));

    const nameElement = document.createElement('span');
    nameElement.classList.add('avatar-text');
    nameElement.textContent = text;
    nameElement.alt = this.hasAttribute('alt')
      ? this.getAttribute('alt')
      : 'Avatar image';

    this.shadowRoot.append(style, nameElement);
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
