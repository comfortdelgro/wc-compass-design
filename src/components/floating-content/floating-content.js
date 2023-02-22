const template = document.createElement('template');
template.innerHTML = `
    <div class="cdg-floating-content-overlay"></div>
`;

export class CdgFloatingContent extends HTMLElement {
  _position = 'bottom';
  containerElement;
  childrenNode;

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
    switch (this._position) {
      case 'bottom':
        this.classList.add('bottom');
        break;

      default:
        break;
    }
  }

  static get observedAttributes() {
    return ['opening', 'width', 'placement'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-floating-content');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'placement' && oldValue !== newValue) {
      this.position = newValue;
    }
    if (attr === 'opening' && oldValue !== newValue) {
      if (newValue) {
        this.style.visibility = 'visible';
        this.style.opacity = '1';
        this.style.height = 'auto';
      } else {
        this.style.visibility = 'hidden';
        this.style.opacity = '0';
        this.style.height = '0';
      }
    }
  }
}
export function createFloating() {
  if (!this.floatingElement) {
    this.containerElement = document.createElement('div');
    const backdropElement = document.createElement('div');
    this.containerElement.setAttribute('class', 'cdg-floating-content-overlay');
    backdropElement.setAttribute('class', 'cdg-floating-content-backdrop');
    backdropElement.addEventListener('click', () => {
      this.removeAttribute('opening');
      this.dispatchEvent(new CustomEvent('onDropdownSelectClose'));
    });

    this.floatingElement = document.createElement('cdg-floating-content');
    this.floatingElement.setAttribute('placement', 'bottom');

    this._offsetTop = this.parentNode.offsetTop + this.parentNode.clientHeight;
    this._offsetLeft = this.parentNode.offsetLeft;
    this._width = this.parentElement.clientWidth;

    this.floatingElement.appendChild(this);
    this.floatingElement.style.top = `${this._offsetTop}px`;
    this.floatingElement.style.left = `${this._offsetLeft}px`;
    this.floatingElement.style.width = `${this._width}px`;

    this.containerElement.appendChild(backdropElement);
    this.containerElement.append(this.floatingElement);
  }
}
