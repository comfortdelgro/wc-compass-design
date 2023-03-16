export class CdgTagBoxItem extends HTMLElement {
  closeElement;
  iconContainer;
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
    this._disabled = !!value;
    if (this.iconContainer) {
      this.iconContainer.disabled = this._disabled;
    }
    if (this._disabled) {
      this.classList.add('cdg-tag-box-item-disabled');
    } else {
      this.classList.remove('cdg-tag-box-item-disabled');
    }
  }

  static get observedAttributes() {
    return ['has-error', 'persist', 'disabled'];
  }

  constructor() {
    super();
    if (!this.hasAttribute('persist')) {
      this.iconContainer = document.createElement('button');
      this.iconContainer.classList.add('cdg-tag-box-item-close-button');
      this.closeElement = document.createElement('cdg-icon');
      this.closeElement.setAttribute('name', 'close');
      this.closeElement.setAttribute('size', '12');
      this.iconContainer.appendChild(this.closeElement);
      if (!this.querySelector('button.cdg-tag-box-item-close-button')) {
        this.appendChild(this.iconContainer);
      }
      if (this.hasAttribute('has-error')) {
        this.hasError = true;
      }
      if (this.hasAttribute('disabled')) {
        this.disabled = true;
      }
      this.iconContainer.addEventListener('click', () =>
        this.handleDispatchEvent('onRemoveItem')
      );
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

    this.addEventListener('click', () => this.handleDispatchEvent('onClick'));
  }

  handleDispatchEvent(eventName) {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { value: this.getAttribute('value') || this.textContent },
      })
    );
  }

  connectedCallback() {
    this.classList.add('cdg-tag-box-item');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (attr) {
      case 'has-error':
        this.hasError = !!newValue;
        break;
      case 'disabled':
        this.disabled = this.hasAttribute('disabled');
        break;

      default:
        break;
    }
  }
}
