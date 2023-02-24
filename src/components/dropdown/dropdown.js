const template = document.createElement('template');
template.innerHTML = `
    <button class="cdg-dropdown-button">
        <div class="cdg-dropdown-button-text"></div>
        <cdg-icon name="arrow-down" class="cdg-dropdown-button-icon" size="16"></cdg-icon>
    </button>
`;

function createSelectedItem(value, text) {
  const templateSelectedItem = document.createElement('template');
  templateSelectedItem.innerHTML = `
      <button class="cdg-dropdown-button-selected-item">
          <span class="cdg-dropdown-button-selected-item-text">${text}</span>
          <cdg-icon name="close" size="10" class="cdg-dropdown-button-selected-item-icon" data-value="${value}"></cdg-icon>
      </button>
  `;
  return templateSelectedItem;
}

export class CdgDropdown extends HTMLElement {
  isOpen = false;
  _placeholder = '';
  _width = '100%';
  labelElement;
  buttonElement;
  buttonTextElement;
  contentElement;
  _isMultiple = false;
  selectedItems = [];

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
    this._isMultiple = this.hasAttribute('multiple');

    this.contentElement.addEventListener(
      'onDropdownSelectClose',
      this.handleCloseContent.bind(this)
    );

    this.contentElement.addEventListener(
      'onDropdownClear',
      this.handleClearButtonClick.bind(this)
    );

    this.childNodes.forEach((item) => {
      const isElement = typeof item.hasAttribute === 'function';

      // Add event click for each dropdown option
      item.addEventListener('click', (event) => {
        this.handleDropdownOptionClick(event, item);
      });

      // Set selected value to current variable
      if (isElement) {
        const checkbox = document.createElement('input');
        if (this._isMultiple) {
          item.setAttribute('multiple', 'true');
          item.classList.add('cdg-dropdown-option-flex');
          checkbox.classList.add('cdg-dropdown-option-checkbox');
          checkbox.type = 'checkbox';
          checkbox.addEventListener('change', (event) => {
            event.preventDefault();
          });
          item.appendChild(checkbox);
        }

        if (item.hasAttribute('selected')) {
          checkbox.checked = true;
          this.selectedItems.push({
            value: item.getAttribute('value'),
            text: item.textContent,
          });
        }
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
    this._isMultiple && this.classList.add('cdg-dropdown-multiple');

    this.buttonElement = this.querySelector('button.cdg-dropdown-button');
    this.buttonTextElement = this.buttonElement.querySelector(
      'div.cdg-dropdown-button-text'
    );
    this.setNewTextButton(false);
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

  handleClearButtonClick() {
    const dropdownOptions = this.contentElement.querySelectorAll(
      'cdg-dropdown-option'
    );
    dropdownOptions.forEach((item) => {
      item.removeAttribute('selected');
      if (this._isMultiple) {
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.checked = false;
      }
    });

    this.selectedItems = [];
    this.setNewTextButton();

    if (!this._isMultiple) {
      this.handleCloseContent();
    }
  }

  setNewTextButton(dispatchEvent = true) {
    if (this.selectedItems.length > 0) {
      if (this._isMultiple) {
        this.buttonTextElement.innerHTML = '';
        this.selectedItems.forEach((item) => {
          this.buttonTextElement.append(
            createSelectedItem(item.value, item.text).content.cloneNode(true)
          );
          const icon = this.buttonTextElement.querySelector(
            `cdg-icon.cdg-dropdown-button-selected-item-icon[data-value="${item.value}"]`
          );
          if (icon) {
            icon.addEventListener('click', (event) => {
              this.handleIconRemoveItemClick(event, item);
            });
          }
        });
      } else {
        this.buttonTextElement.textContent = this.selectedItems[0].text;
      }
    } else {
      if (this._placeholder) {
        this.buttonTextElement.textContent = this._placeholder;
      }
    }

    if (dispatchEvent) {
      this.dispatchEvent(
        new CustomEvent('onchangevalue', {
          currentValue: this.selectedItems.map((item) => item.value),
        })
      );
    }
  }

  handleIconRemoveItemClick(event, item) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedItems = this.selectedItems.filter(
      (selectedItem) => selectedItem.value !== item.value
    );
    const dropdownItem = this.contentElement.querySelector(
      `cdg-dropdown-option[value="${item.value}"]`
    );
    dropdownItem.classList.remove('cdg-dropdown-option-selected');
    dropdownItem.removeAttribute('selected');
    const checkbox = dropdownItem.querySelector('input[type="checkbox"]');
    checkbox.checked = false;
    this.setNewTextButton();
  }

  handleDropdownOptionClick(event, dropdownOption) {
    const selectedValue = event.target.getAttribute('value');
    const selectedText = dropdownOption.textContent;
    if (!this._isMultiple) {
      if (!dropdownOption.hasAttribute('selected')) {
        // Remove all previous selected options
        document
          .querySelectorAll('cdg-dropdown-option')
          .forEach((b) => b.removeAttribute('selected'));

        dropdownOption.setAttribute('selected', 'true');
        this.selectedItems = [{ value: selectedValue, text: selectedText }];
      }
      this.handleCloseContent();
    } else {
      const checkbox = dropdownOption.querySelector('input[type="checkbox"');
      if (checkbox) {
        if (event.target !== dropdownOption) {
          checkbox.checked = checkbox.checked;
        } else {
          checkbox.checked = !checkbox.checked;
        }
        if (checkbox.checked) {
          this.selectedItems.push({ value: selectedValue, text: selectedText });
          dropdownOption.setAttribute('selected', 'true');
          dropdownOption.classList.add('cdg-dropdown-option-selected');
        } else {
          const selectedIndex = this.selectedItems.findIndex(
            (item) => item.value == selectedValue
          );
          this.selectedItems.splice(selectedIndex, 1);
          dropdownOption.classList.remove('cdg-dropdown-option-selected');
          dropdownOption.removeAttribute('selected');
        }
      }
    }
    this.setNewTextButton();
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
