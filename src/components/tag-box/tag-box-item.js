export class CdgTagBoxItem extends HTMLElement {
  closeElement;
  _hasError;
  _disabled;

  get hasError() {
    return this._hasError;
  }

  set hasError(value) {
    this._hasError = value;
    if (this._hasError) {
      this.classList.add('cdg-tag-box-item-has-error');
    } else {
      this.classList.remove('cdg-tag-box-item-has-error');
    }
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = value;
    if (this._disabled) {
      this.classList.add('cdg-tag-box-item-disabled');
    } else {
      this.classList.remove('cdg-tag-box-item-disabled');
    }
  }

  static get observedAttributes() {
    return ['hasError'];
  }

  constructor() {
    super();
    const iconContainer = document.createElement('button');
    iconContainer.classList.add('cdg-tag-box-item-close-button');
    this.closeElement = document.createElement('cdg-icon');
    this.closeElement.setAttribute('name', 'close');
    this.closeElement.setAttribute('size', '12');
    iconContainer.appendChild(this.closeElement);
    this.appendChild(iconContainer);
    if (this.hasAttribute('has-error')) {
      this.hasError = true;
    }
    if (this.hasAttribute('disabled')) {
      this.disabled = true;
      iconContainer.disabled = true;
    }
    if (this.hasAttribute('icon-name')) {
      const icon = document.createElement('cdg-icon');
      icon.setAttribute('name', this.getAttribute('icon-name'));
      icon.setAttribute('size', '12');
      if (this.hasAttribute('icon-color')) {
        icon.style.color = this.getAttribute('icon-color');
      }
      this.prepend(icon);
    }
  }

  connectedCallback() {
    this.classList.add('cdg-tag-box-item');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attr] = newValue;
  }
}
