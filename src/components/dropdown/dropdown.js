const template = document.createElement('template');
template.innerHTML = `
    <button class="cdg-dropdown-button">
        <span class="cdg-dropdown-button-text"></span>
        <cdg-icon name="arrow-down" size="16"></cdg-icon>
    </button>
`;

export class CdgDropdown extends HTMLElement {
  isOpen = false;
  _title = 'dropdown';
  _width = '100%';
  labelElement;
  buttonElement;
  buttonTextElement;
  contentElement;

  static get observedAttributes() {
    return ['title', 'width', 'label'];
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    if (this.buttonElement) {
      this.buttonTextElement.textContent = this._title;
    }
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
    if (this.buttonElement) {
      this.buttonElement.style.width = this._width;
    }
  }

  constructor() {
    super();
    this.prepend(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown');
    this.tabIndex = 0;

    this.buttonElement = this.querySelector('button.cdg-dropdown-button');
    this.buttonTextElement = this.buttonElement.querySelector(
      'span.cdg-dropdown-button-text'
    );
    this.buttonTextElement.textContent = this._title;
    this.buttonElement.addEventListener('click', this.handleToggle.bind(this));
    this.buttonElement.style.width = this.width;

    this.contentElement = this.querySelector('cdg-dropdown-select');
    this.contentElement.removeAttribute('opening');

    this.contentElement.addEventListener('onDropdownSelectClose', () => {
      this.handleToggle();
    });
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attr) {
      case 'title':
        this.title = newValue;
        break;
      case 'width':
        this.width = newValue;
        break;
      case 'label':
        this.label = newValue;
        break;

      default:
        break;
    }
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.classList.add('opening');
      this.contentElement.setAttribute('opening', 'true');
    } else {
      this.classList.remove('opening');
      this.contentElement.removeAttribute('opening');
    }
    this.dispatchEvent(new CustomEvent('onChange', { isOpen: this.isOpen }));
  }
}
