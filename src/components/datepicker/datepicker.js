import { createFloating } from '../floating-content/floating-content';

const customParseFormat = window.dayjs_plugin_customParseFormat;
dayjs.extend(customParseFormat);

function createInputs(isDouble, startTitle = '', endTitle = '') {
  const template = document.createElement('template');
  template.innerHTML = `
<div class="cdg-datepicker-input-container">
    <div class="cdg-datepicker-input-content">
        <label class="cdg-input-group" style="width: 197px">
            <span class="cdg-input-label">${startTitle}</span>
            <div class="cdg-input-with-icon right">
                <input class="cdg-input" data-type="start-date" />
                <cdg-icon name="filledArrowDown" size="16"></cdg-icon>
            </div>
        </label>
    </div>
    ${
      isDouble
        ? `
        <div class="cdg-datepicker-input-content">
            <label class="cdg-input-group" style="width: 197px">
                <span class="cdg-input-label">${endTitle}</span>
                <div class="cdg-input-with-icon right">
                    <input class="cdg-input" data-type="end-date" />
                    <cdg-icon name="filledArrowDown" size="16"></cdg-icon>
                </div>
            </label>
        </div>`
        : ''
    }
</div>
`;
  return template;
}

function createCalendar(isDouble) {
  const templateCalendar = document.createElement('template');
  templateCalendar.innerHTML = `
    <div class="cdg-calendar-container">
        <cdg-calendar has-bottom ${isDouble ? 'double' : ''}></cdg-calendar>
    </div>
    `;
  return templateCalendar;
}

export class CdgDatePicker extends HTMLElement {
  inputDateElement;
  floatingElement;
  anchorElement;
  calendarContainerElement;
  calendarElement;
  inputContentElements;

  format = 'YYYY-MM-DD';
  _selectedStartDate;
  _selectedEndDate;
  isDouble = true;

  get selectedStartDate() {
    return this._selectedStartDate;
  }

  set selectedStartDate(value) {
    this._selectedStartDate = value;
    if (value) {
      this.inputContentElements.item(0).querySelector('input').value = dayjs(
        value
      ).format(this.format);
      this.calendarElement.setAttribute(
        'start-date',
        dayjs(value).format('YYYY-MM-DD')
      );
      if (!this.isDouble) return;
      this.inputContentElements.item(1).querySelector('input').focus();
    } else {
      this.inputContentElements.item(0).querySelector('input').value = '';
      this.calendarElement.setAttribute('start-date', '');
      if (!this.isDouble) return;
      this.inputContentElements.item(1).querySelector('input').value = '';
      this.inputContentElements.item(0).querySelector('input').focus();
    }
  }

  get selectedEndDate() {
    return this._selectedEndDate;
  }

  set selectedEndDate(value) {
    this._selectedEndDate = value;
    if (value) {
      this.inputContentElements.item(1).querySelector('input').value = dayjs(
        value
      ).format(this.format);
      this.calendarElement.setAttribute(
        'end-date',
        dayjs(value).format('YYYY-MM-DD')
      );
    } else {
      this.inputContentElements.item(1).querySelector('input').value = '';
      this.calendarElement.setAttribute('end-date', '');
    }
  }

  static get observedAttributes() {
    return ['format', 'double'];
  }

  constructor() {
    super();
    this.isDouble = !!this.hasAttribute('double');
    // Create inputs
    this.append(
      createInputs(
        this.isDouble,
        this.getAttribute('start-title') || '',
        this.getAttribute('end-title') || ''
      ).content.cloneNode(true)
    );

    // Create calendar
    this.append(createCalendar(this.isDouble).content.cloneNode(true));
    this.calendarContainerElement = this.querySelector(
      '.cdg-calendar-container'
    );
    this.calendarElement =
      this.calendarContainerElement.querySelector('cdg-calendar');
    this.calendarElement.addEventListener(
      'ondateclick',
      this.handleDateClick.bind(this)
    );
    this.calendarElement.addEventListener(
      'onClearClick',
      this.handleClearClick.bind(this)
    );

    if (this.hasAttribute('format')) {
      this.format = this.getAttribute('format');
    }
    if (!this.anchorElement) {
      this.anchorElement = this.querySelector(
        '.cdg-datepicker-input-container'
      );
      const currentComponent = this;
      this.inputContentElements = this.anchorElement.querySelectorAll(
        '.cdg-datepicker-input-content'
      );
      for (let index = 0; index < this.inputContentElements.length; index++) {
        const inputContentElement = this.inputContentElements.item(index);
        const inputElement = inputContentElement.querySelector('input');
        inputElement.setAttribute('placeholder', this.format);

        inputElement.addEventListener('focus', function () {
          currentComponent.floatingElement.setAttribute('opening', 'true');
          currentComponent.calendarElement.setAttribute('open', 'true');
        });
        inputElement.addEventListener('blur', this.handleInputBlur.bind(this));
      }
    }
  }

  connectedCallback() {
    this.classList.add('cdg-datepicker');
    if (!this.floatingElement) {
      this.floatingElement = createFloating.bind(this)(
        this.anchorElement,
        this.calendarContainerElement,
        'bottomLeft',
        'cdg-popover-floating-container',
        false,
        false,
        true,
        false
      );
    }
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attr] = newValue;

    switch (attr) {
      case 'start-date':
      case 'date':
        this.selectedStartDate = new Date(newValue);
        break;

      case 'end-date':
        this.selectedEndDate = new Date(newValue);
        break;

      default:
        break;
    }
  }

  handleInputBlur(event) {
    const isValidDate = dayjs(event.target.value, this.format, true).isValid();
    const isStartDateInput =
      event.target.getAttribute('data-type') === 'start-date';
    if (isValidDate) {
      const valueDate = new Date(event.target.value);
      if (isStartDateInput) {
        this.selectedStartDate = valueDate;
        if (this.selectedStartDate > this.selectedEndDate) {
          this.selectedEndDate = null;
        }
      } else {
        if (this.selectedStartDate > valueDate) {
          this.selectedEndDate = null;
          this.selectedStartDate = valueDate;
        } else {
          this.selectedEndDate = valueDate;
        }
      }
    } else {
      const oldValue = isStartDateInput
        ? this.selectedStartDate
        : this.selectedEndDate;
      event.target.value = oldValue ? dayjs(oldValue).format(this.format) : '';
    }
    if (!this.anchorElement.contains(event.relatedTarget)) {
      this.floatingElement.removeAttribute('opening');
      this.calendarElement.removeAttribute('open', 'true');
    }
  }

  handleClearClick() {
    this.selectedStartDate = null;
    if (this.isDouble) {
      this.selectedEndDate = null;
      this.dispatchEvent(
        new CustomEvent('onDateChange', {
          detail: {
            startDate: null,
            endDate: null,
          },
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('onDateChange', {
          detail: {
            date: null,
          },
        })
      );
    }
  }

  handleDateClick(event) {
    const selectedDate = new Date(dayjs(event.detail).format('YYYY-MM-DD'));
    if (!this.isDouble) {
      this.selectedStartDate = selectedDate;
      this.floatingElement.removeAttribute('opening');
      this.calendarElement.removeAttribute('open', 'true');

      this.dispatchEvent(
        new CustomEvent('onDateChange', {
          detail: {
            date: this.selectedStartDate,
          },
        })
      );
      return;
    }
    if (this.selectedStartDate && this.selectedEndDate) {
      this.selectedStartDate = selectedDate;
      this.selectedEndDate = null;
      return;
    }

    if (
      !this.selectedStartDate ||
      (this.selectedStartDate &&
        selectedDate.getTime() < this.selectedStartDate.getTime())
    ) {
      this.selectedStartDate = selectedDate;
    } else {
      this.selectedEndDate = selectedDate;
      this.floatingElement.removeAttribute('opening');
      this.calendarElement.removeAttribute('open', 'true');

      this.dispatchEvent(
        new CustomEvent('onDateChange', {
          detail: {
            startDate: this.selectedStartDate,
            endDate: this.selectedEndDate,
          },
        })
      );
    }
  }
}
