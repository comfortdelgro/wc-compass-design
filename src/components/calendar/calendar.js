import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';

function createCalendar(id = 'cdg-calendar') {
  const templateSelectedItem = document.createElement('template');
  templateSelectedItem.innerHTML = `
    <div class="cdg-calendar-container" id="${id}"></div>
    `;
  return templateSelectedItem;
}

export class CdgCalendar extends HTMLElement {
  calendarEl;
  calendar;
  _selectedStartDate;
  _selectedEndDate;
  _id;
  isDouble;

  get selectedStartDate() {
    return this._selectedStartDate;
  }

  set selectedStartDate(value) {
    this._selectedStartDate = value;
    this.calendar.destroy();
    this.calendar.render();
  }

  get selectedEndDate() {
    return this._selectedEndDate;
  }

  set selectedEndDate(value) {
    this._selectedEndDate = value;
    this.calendar.destroy();
    this.calendar.render();
  }

  static get observedAttributes() {
    return ['date', 'start-date', 'end-date'];
  }

  constructor() {
    super();
    this._id = this.hasAttribute('id')
      ? this.getAttribute('id')
      : 'cdg-calendar';
    this.isDouble = this.hasAttribute('double');

    this.isDouble && this.classList.add('double-calendar-view');

    this.prepend(createCalendar(this._id).content.cloneNode(true));
    this.calendarEl = document.getElementById(this._id);
    const multipleView = {
      plugins: [dayGridPlugin, multiMonthPlugin, interactionPlugin],
      initialView: 'multiMonthFourMonth',
      views: {
        multiMonthFourMonth: {
          type: 'multiMonth',
          duration: { months: 2 },
          multiMonthTitleFormat: { month: 'long', year: 'numeric' },
        },
      },
      headerToolbar: {
        left: 'prev',
        center: null,
        right: 'next',
      },
      selectable: false,
      unselectAuto: false,
      dateClick: this.handleDateClick.bind(this),
      dayCellDidMount: this.renderCell.bind(this),
    };

    const singleView = {
      plugins: [dayGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next',
      },
      initialView: 'dayGridMonth',
      unselectAuto: false,
      dateClick: this.handleSingleDateClick.bind(this),
      dayCellDidMount: this.renderCell.bind(this),
    };

    this.calendar = new Calendar(
      this.calendarEl,
      this.isDouble ? multipleView : singleView
    );
    this.calendar.render();
  }

  connectedCallback() {
    this.classList.add('cdg-calendar');
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

  handleSingleDateClick(info) {
    this.selectedStartDate = info.date;

    this.dispatchEvent(
      new CustomEvent('onDateChange', {
        detail: this.selectedStartDate,
      })
    );
  }

  handleDateClick(info) {
    if (this.selectedStartDate && this.selectedEndDate) {
      this.selectedStartDate = info.date;
      this.selectedEndDate = null;
      return;
    }

    if (
      !this.selectedStartDate ||
      info.date.getTime() < this.selectedStartDate.getTime()
    ) {
      this.selectedStartDate = info.date;
    } else {
      this.selectedEndDate = info.date;
    }

    this.dispatchEvent(
      new CustomEvent('onDateChange', {
        detail: {
          startDate: this.selectedStartDate,
          endDate: this.selectedEndDate,
        },
      })
    );
  }

  renderCell(params) {
    if (!this.selectedStartDate) return;
    const isStartDate =
      params.date.getTime() === this.selectedStartDate.getTime();
    const isEndDate =
      this.selectedEndDate &&
      params.date.getTime() === this.selectedEndDate.getTime();
    const isInRange =
      this.selectedEndDate &&
      params.date.getTime() > this.selectedStartDate.getTime() &&
      params.date.getTime() < this.selectedEndDate.getTime();

    if (isStartDate) {
      params.el.classList.add('active-selected-date');
    } else if (isInRange) {
      params.el.classList.add('selected-date');
    } else if (isEndDate) {
      params.el.classList.add('active-selected-date');
    }
  }
}
