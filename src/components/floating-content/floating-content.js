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
    return ['opening', 'placement'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-floating-content');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attr) {
      case 'placement':
        this.position = newValue;
        break;
      case 'opening':
        if (newValue) {
          this.style.visibility = 'visible';
          this.style.opacity = '1';
          this.style.height = 'auto';
          if (this.parentElement) {
            const anchorElement = this.parentElement.anchorElement;
            const nearestScrollParent = getScrollParent(anchorElement);

            // New position
            const topPosition = nearestScrollParent
              ? anchorElement.offsetTop +
                anchorElement.clientHeight -
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
        break;

      default:
        break;
    }
  }
}

/**
 * Create a new floating component
 * @param {HTMLElement} anchorElement root element
 * @param {boolean} isFullWidth is full-width with root
 */
export function createFloating(anchorElement, isFullWidth = false) {
  if (!this.floatingElement) {
    const containerElement = document.createElement('div');
    containerElement.setAttribute('class', 'cdg-floating-content-overlay');
    containerElement.anchorElement = anchorElement;

    const backdropElement = document.createElement('div');
    backdropElement.setAttribute('class', 'cdg-floating-content-backdrop');
    backdropElement.addEventListener('click', () => {
      this.removeAttribute('opening');
      this.dispatchEvent(new CustomEvent('onDropdownSelectClose'));
    });

    this.floatingElement = document.createElement('cdg-floating-content');
    this.floatingElement.setAttribute('placement', 'bottom');

    const topPosition = anchorElement.offsetTop + anchorElement.clientHeight;
    const leftPosition = anchorElement.offsetLeft;

    if (isFullWidth) {
      this.floatingElement.style.width = `${anchorElement.clientWidth}px`;
    }

    this.floatingElement.appendChild(this);
    this.floatingElement.style.top = `${topPosition}px`;
    this.floatingElement.style.left = `${leftPosition}px`;

    containerElement.appendChild(backdropElement);
    containerElement.append(this.floatingElement);
  }
}
