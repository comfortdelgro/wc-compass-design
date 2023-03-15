import { isElement } from '../../main';

const paddingContainer = 32;
const hiddenNumberWidth = 32;
const iconToggleWidth = 24;

function createTagBoxItem(content) {
  const template = document.createElement('template');
  template.innerHTML = `
  <cdg-tag-box-item>${content}</cdg-tag-box-item>
  `;
  return template;
}

export class CdgTagBoxContainer extends HTMLElement {
  labelElement;
  containerElement;
  mainElement;
  bottomElement;
  helperTextElement;
  hiddenItemElements = [];
  hiddenNumberElement;
  ctaButtons;
  toggleIconELement;
  inputElement;
  _show = false;
  _type = 'text-box';

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
    this.containerElement.classList.add(`cdg-tag-box-${this._type}`);
  }

  static get observedAttributes() {
    return ['type'];
  }

  constructor() {
    super();
    this.mainElement = document.createElement('div');
    this.mainElement.classList.add('cdg-tag-box-main');

    if (this.hasAttribute('label-left')) {
      this.classList.add('cdg-tag-box-label-left');
    }

    this.createInputContent();

    if (this.hasAttribute('label')) {
      this.labelElement = document.createElement('span');
      this.labelElement.classList.add('cdg-input-label');
      this.labelElement.innerHTML = this.getAttribute('label');
      this.prepend(this.labelElement);
    }

    this.createBottomContainer();
  }

  createInputContent() {
    this.containerElement = document.createElement('div');
    this.containerElement.classList.add('cdg-tag-box-container');
    this.containerElement.tabIndex = 0;
    this.inputElement = document.createElement('input');
    this.inputElement.classList.add('cdg-tag-box-input-text');
    const currentComponent = this;
    this.containerElement.addEventListener('focus', function () {
      const canOpenInput = currentComponent._show || currentComponent.type !== 'text-box';
      if (canOpenInput) {
        currentComponent.containerElement.appendChild(
          currentComponent.inputElement
        );
        currentComponent.inputElement.focus();
      }
    });
    this.containerElement.addEventListener('blur', function (event) {
      const canOpenInput = currentComponent._show || currentComponent.type !== 'text-box';
      if (canOpenInput) {
        if (event.relatedTarget === currentComponent.inputElement) return;
        currentComponent.containerElement.removeChild(
          currentComponent.inputElement
        );
      }
    });

    this.inputElement.addEventListener('blur', function (event) {
      const canOpenInput = currentComponent._show || currentComponent.type !== 'text-box';
      if (canOpenInput) {
        if (
          event.relatedTarget === currentComponent.containerElement ||
          currentComponent.containerElement.contains(event.relatedTarget)
        )
          return;
        currentComponent.containerElement.removeChild(
          currentComponent.inputElement
        );
      }
    });

    this.inputElement.addEventListener('keyup', function (event) {
      const canOpenInput = currentComponent._show || currentComponent.type !== 'text-box';
      if (canOpenInput) {
        if (event.key === 'Enter' && event.target.value) {
          currentComponent.containerElement.appendChild(
            createTagBoxItem(event.target.value).content.cloneNode(true)
          );
          currentComponent.inputElement.blur();
          currentComponent.inputElement.value = '';
        }
      }
    });

    this.type = this.getAttribute('type') || 'text-box';

    if (this.hasAttribute('icon-name')) {
      const icon = document.createElement('cdg-icon');
      const iconContainer = document.createElement('div');
      iconContainer.classList.add('cdg-tag-box-pre-icon');
      icon.setAttribute('name', this.getAttribute('icon-name'));
      icon.setAttribute('size', '16');
      iconContainer.appendChild(icon);
      this.containerElement.prepend(iconContainer);
    }

    for (let index = 0; index < this.childNodes.length; index++) {
      const element = this.childNodes.item(index);
      if (this.isTagBoxItem(element)) {
        isElement(element) && this.containerElement.appendChild(element);
      }
    }
    this.mainElement.appendChild(this.containerElement);
    this.appendChild(this.mainElement);
    // Show/hide items for only text-box depends on the number of lines of tags
    if (this.type === 'text-box') {
      this.toggleItemForTextBox();
    }
  }

  canOpenInput() {
    return this._show || this.type !== ' text-box';
  }

  toggleItemForTextBox() {
    let totalWidth = 0;
    for (
      let index = 0;
      index < this.containerElement.childNodes.length;
      index++
    ) {
      const element = this.containerElement.childNodes.item(index);
      if (isElement(element)) {
        totalWidth += element.offsetWidth + 8;
        const mainContentWidth =
          this.containerElement.offsetWidth -
          paddingContainer -
          hiddenNumberWidth -
          iconToggleWidth;

        // Hide tag-box-item when over width
        if (totalWidth > mainContentWidth && this.isTagBoxItem(element)) {
          element.style.display = 'none';
          this.hiddenItemElements.push(element);
        }
      }
    }

    if (this.hiddenItemElements.length > 0) {
      this.hiddenNumberElement = document.createElement('div');
      this.hiddenNumberElement.classList.add('cdg-tag-box-item');
      this.hiddenNumberElement.innerText = `+${this.hiddenItemElements.length}`;
      this.containerElement.appendChild(this.hiddenNumberElement);

      // Create toggle icon on the right
      const toggleIcon = document.createElement('cdg-icon');
      this.toggleIconELement = document.createElement('button');
      this.toggleIconELement.classList.add('cdg-tag-box-toggle-icon');
      toggleIcon.setAttribute('name', 'arrowDown');
      toggleIcon.setAttribute('size', '16');
      this.toggleIconELement.appendChild(toggleIcon);
      this.containerElement.appendChild(this.toggleIconELement);
      this.toggleIconELement.addEventListener(
        'click',
        this.handleToggleIconClick.bind(this)
      );
    }
  }

  handleToggleIconClick() {
    this._show = !this._show;
    this.toggleIconELement.classList.toggle('cdg-tag-box-toggle-icon-show');
    this.containerElement.classList.toggle('open');
    this.hiddenItemElements.forEach((hidItem) => {
      hidItem.style.display = this._show ? 'flex' : 'none';
      this.hiddenNumberElement.style.display = !this._show ? 'flex' : 'none';
    });
  }

  isTagBoxItem(el) {
    return isElement(el) && el.tagName.toLowerCase() === 'cdg-tag-box-item';
  }

  createBottomContainer() {
    this.ctaButtons = this.querySelectorAll('[tag-box-button]');
    this.hasHelperText = this.hasAttribute('helperText');
    // Show bottom when has helper-text or call to action buttons
    if (this.hasHelperText || this.ctaButtons.length) {
      this.bottomElement = document.createElement('div');
      this.bottomElement.classList.add('cdg-tag-box-bottom');
      // Create helper text on left
      if (this.hasHelperText) {
        this.helperTextElement = document.createElement('div');
        this.helperTextElement.classList.add('cdg-tag-box-bottom-text');
        this.helperTextElement.innerText = this.getAttribute('helperText');
        this.bottomElement.appendChild(this.helperTextElement);
      }
      // Create buttons container on right with attribute "tag-box-button"
      if (this.ctaButtons.length) {
        const ctaContainer = document.createElement('div');
        ctaContainer.classList.add('cdg-tag-box-bottom-text');
        for (let index = 0; index < this.ctaButtons.length; index++) {
          const element = this.ctaButtons.item(index);
          ctaContainer.appendChild(element);
        }
        this.bottomElement.appendChild(ctaContainer);
      }
      this.mainElement.appendChild(this.bottomElement);
    }
  }

  connectedCallback() {
    this.classList.add('cdg-tag-box');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attr] = newValue;
  }
}
