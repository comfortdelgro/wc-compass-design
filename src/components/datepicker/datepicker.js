import { createFloating } from '../floating-content/floating-content';

const template = document.createElement('template');
template.innerHTML = `
<div class="cdg-datepicker-input-container">
    <label class="cdg-input-group" style="width: 197px">
    <span class="cdg-input-label">Start Date</span>
    <div class="cdg-input-with-icon right">
        <input class="cdg-input" placeholder="DD-MM-YYYY" />
        <cdg-icon name="filledArrowDown" size="16"></cdg-icon>
    </div>
    </label>
    <label class="cdg-input-group" style="width: 197px">
    <span class="cdg-input-label">End Date</span>
    <div class="cdg-input-with-icon right">
        <input class="cdg-input" placeholder="DD-MM-YYYY" />
        <cdg-icon name="filledArrowDown" size="16"></cdg-icon>
    </div>
    </label>
</div>
`;

const templateCalendar = document.createElement('template');
templateCalendar.innerHTML = `
<div class="cdg-calendar-container">
  <cdg-calendar has-bottom double></cdg-calendar>
</div>
`;

export class CdgDatePicker extends HTMLElement {
  inputDateElement;
  floatingElement;
  anchorElement;
  calendarContainerElement;
  calendarElement;
  inputElements;

  constructor() {
    super();
    this.append(template.content.cloneNode(true));
    this.append(templateCalendar.content.cloneNode(true));
    this.calendarContainerElement = this.querySelector(
      '.cdg-calendar-container'
    );
    this.calendarElement =
      this.calendarContainerElement.querySelector('cdg-calendar');
    this.calendarElement.addEventListener(
      'ondateclick',
      this.handleDateClick.bind(this)
    );
  }

  handleDateClick(event) {
    console.log(event.detail);
  }

  connectedCallback() {
    this.classList.add('cdg-datepicker');
    if (!this.floatingElement) {
      if (!this.anchorElement) {
        this.anchorElement = this.querySelector(
          '.cdg-datepicker-input-container'
        );
        const currentComponent = this;
        this.inputElements = this.anchorElement.querySelectorAll('input');
        for (let index = 0; index < this.inputElements.length; index++) {
          const inputElement = this.inputElements.item(index);
          inputElement.addEventListener('focus', function () {
            currentComponent.floatingElement.setAttribute('opening', 'true');
          });
          inputElement.addEventListener('blur', function (event) {
            if (!currentComponent.anchorElement.contains(event.relatedTarget)) {
              currentComponent.floatingElement.removeAttribute('opening');
            }
          });
        }
      }
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
}
