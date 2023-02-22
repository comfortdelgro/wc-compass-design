const template = document.createElement('template');
template.innerHTML = `
    <div class="cdg-floating-content-overlay"></div>
`;

function getScrollParent(node) {
  if (node == null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentNode);
  }
}

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
    return ['opening', 'width', 'placement', 'anchor'];
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
        if (this.parentElement) {
          const nearestScrollParent = getScrollParent(
            this.parentElement.anchorElement
          );
          const topPosition = nearestScrollParent
            ? this.parentElement.anchorElement.offsetTop +
              this.parentElement.anchorElement.clientHeight -
              nearestScrollParent.scrollTop
            : 0;
          this.style.top = `${topPosition}px`;
          document.body.appendChild(this.parentElement);
        }
      } else {
        this.style.visibility = 'hidden';
        this.style.opacity = '0';
        this.style.height = '0';
        if (this.parentElement) {
          document.body.removeChild(this.parentElement);
        }
      }
    }
  }
}
export function createFloating(anchorElement) {
  if (!this.floatingElement) {
    const containerElement = document.createElement('div');
    const backdropElement = document.createElement('div');
    containerElement.setAttribute('class', 'cdg-floating-content-overlay');
    backdropElement.setAttribute('class', 'cdg-floating-content-backdrop');
    backdropElement.addEventListener('click', () => {
      this.removeAttribute('opening');
      this.dispatchEvent(new CustomEvent('onDropdownSelectClose'));
    });
    containerElement.anchorElement = anchorElement;

    this.floatingElement = document.createElement('cdg-floating-content');
    this.floatingElement.setAttribute('placement', 'bottom');

    const topPosition = anchorElement.offsetTop + anchorElement.clientHeight;
    const leftPosition = anchorElement.offsetLeft;
    this._width = this.parentElement.clientWidth;

    this.floatingElement.appendChild(this);
    this.floatingElement.style.top = `${topPosition}px`;
    this.floatingElement.style.left = `${leftPosition}px`;
    this.floatingElement.style.width = `${this._width}px`;

    containerElement.appendChild(backdropElement);
    containerElement.append(this.floatingElement);
  }
}
