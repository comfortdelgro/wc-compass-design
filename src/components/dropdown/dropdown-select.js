import { createFloating } from '../floating-content/floating-content';

const templateClearOption = document.createElement('template');
templateClearOption.innerHTML = `
    <cdg-dropdown-option class="cdg-dropdown-option-clear-item"></cdg-dropdown-option>
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

export class CdgDropdownSelect extends HTMLElement {
  floatingElement;
  containerElement;
  selectElement;
  _offsetTop;
  _offsetLeft;
  _width;
  _open;

  static get observedAttributes() {
    return ['opening'];
  }

  constructor() {
    super();
    this.selectElement = this.parentNode;
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown-select');
    createFloating.bind(this)();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'opening' && oldValue !== newValue) {
      this.style.display = newValue ? 'flex' : 'none';
      if (newValue) {
        const nearestScrollParent = getScrollParent(this.selectElement);
        const topPosition = nearestScrollParent
          ? this._offsetTop - nearestScrollParent.scrollTop
          : 0;
        if (this.floatingElement) {
          this.floatingElement.style.top = `${topPosition}px`;
          this.floatingElement.setAttribute('opening', 'true');
        }
        if (this.containerElement) {
          document.body.appendChild(this.containerElement);
        }
      } else {
        if (this.floatingElement) {
          this.floatingElement.removeAttribute('opening');
        }
        if (this.containerElement) {
          document.body.removeChild(this.containerElement);
        }
      }
    }
  }
}
