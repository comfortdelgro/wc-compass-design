const template = document.createElement('template');
template.innerHTML = `
    <button class="cdg-dropdown-button">
        <span class="cdg-dropdown-button-text"></span>
        <cdg-icon name="arrow-down" size="16"></cdg-icon>
    </button>
`;

export class CdgDropdown extends HTMLElement {
  isOpen = false;
  _placeholder = 'dropdown';
  _width = '100%';
  labelElement;
  buttonElement;
  buttonTextElement;
  contentElement;
  displayText = [];
  displayValues = [];

  static get observedAttributes() {
    return ['placeholder', 'width', 'multiple'];
  }

  get placeholder() {
    return this._placeholder;
  }

  set placeholder(value) {
    this._placeholder = value;
    if (this.buttonElement) {
      this.buttonTextElement.textContent = this._placeholder;
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
    this.contentElement = document.createElement('cdg-dropdown-select');

    this.contentElement.addEventListener(
      'onDropdownSelectClose',
      this.handleCloseContent.bind(this)
    );

    this.contentElement.addEventListener('onDropdownClear', () => {
      const dropdownOptions = this.contentElement.querySelectorAll(
        'cdg-dropdown-option'
      );
      dropdownOptions.forEach((item) => {
        item.removeAttribute('selected');
      });
      if (this._placeholder) {
        this.buttonTextElement.textContent = this._placeholder;
      }
      this.handleCloseContent();
    });

    this.childNodes.forEach((item) => {
      // Add event click for each dropdown option
      item.addEventListener('click', (event) => {
        this.handleDropdownOptionClick(event, item);
      });

      // Set selected value to current variable
      if (
        typeof item.hasAttribute === 'function' &&
        item.hasAttribute('selected')
      ) {
        this.displayText.push(item.textContent);
        this.displayValues.push(item.getAttribute('value'));
      }
      this.contentElement.appendChild(item);
    });

    if (this.hasAttribute('header-title')) {
      this.contentElement.setAttribute(
        'header-title',
        this.getAttribute('header-title')
      );
    }
    this.appendChild(this.contentElement);
  }

  connectedCallback() {
    this.classList.add('cdg-dropdown');

    this.buttonElement = this.querySelector('button.cdg-dropdown-button');
    this.buttonTextElement = this.buttonElement.querySelector(
      'span.cdg-dropdown-button-text'
    );
    this.setNewTextButton();
    this.buttonElement.addEventListener('click', this.handleToggle.bind(this));
    this.buttonElement.addEventListener(
      'blur',
      this.handleCloseContent.bind(this)
    );
    this.buttonElement.style.width = this.width;
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attr] = newValue;
  }

  setNewTextButton() {
    if (this.displayText.length > 0) {
      this.buttonTextElement.textContent = this.displayText.join(',');
    } else {
      if (this._placeholder) {
        this.buttonTextElement.textContent = this._placeholder;
      }
    }
  }

  handleDropdownOptionClick(event, dropdownOption) {
    if (!this.hasAttribute('multiple')) {
      if (!dropdownOption.hasAttribute('selected')) {
        // Remove all previous selected options
        document
          .querySelectorAll('cdg-dropdown-option')
          .forEach((b) => b.removeAttribute('selected'));

        this.displayValues = [event.target.getAttribute('value')];
        dropdownOption.setAttribute('selected', 'true');
        this.displayText = [dropdownOption.textContent];
        this.setNewTextButton();

        this.dispatchEvent(
          new CustomEvent('onChangeValue', {
            currentValue: this.displayValues[0],
          })
        );
      }
    }
    this.handleCloseContent();
  }

  handleCloseContent() {
    this.isOpen = false;
    this.classList.remove('opening');
    this.contentElement.removeAttribute('opening');
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
    this.dispatchEvent(new CustomEvent('onToggle', { isOpen: this.isOpen }));
  }
}
