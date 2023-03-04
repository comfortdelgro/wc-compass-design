const weekdayPlugin = window.dayjs_plugin_weekday;
const weekOfYear = window.dayjs_plugin_weekOfYear;
dayjs.extend(weekdayPlugin);
dayjs.extend(weekOfYear);

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  { text: 'Jan', value: 0 },
  { text: 'Feb', value: 1 },
  { text: 'Mar', value: 2 },
  { text: 'Apr', value: 3 },
  { text: 'May', value: 4 },
  { text: 'Jun', value: 5 },
  { text: 'Jul', value: 6 },
  { text: 'Aug', value: 7 },
  { text: 'Sep', value: 8 },
  { text: 'Oct', value: 9 },
  { text: 'Nov', value: 10 },
  { text: 'Dec', value: 11 },
];
const DISPLAY_YEARS_LENGTH = MONTHS.length;
const DISPLAY_WEEKDAYS_LENGTH = WEEKDAYS.length;
const TODAY = dayjs().format('YYYY-MM-DD');
const INITIAL_YEAR = dayjs().format('YYYY');
const INITIAL_MONTH = dayjs().format('M');

const templateHeader = document.createElement('template');
templateHeader.innerHTML = `
  <section class="calendar-month-header">
    <section class="calendar-month-header-selectors">
      <span id="previous-month-selector" class="previous-month-selector"> < </span>
      <!-- <span id="present-month-selector">Today</span> -->
      <span id="next-month-selector" class="next-month-selector">></span>
    </section>
  </section>
`;

function createDayLayout() {
  const monthDiv = document.createElement('div');
  monthDiv.classList.add('calendar-month');
  monthDiv.setAttribute('id', 'calendar-month');
  const contentMonthDiv = document.createElement('div');
  contentMonthDiv.classList.add('content-month');
  contentMonthDiv.setAttribute('id', 'content-month');
  const monthTitleDiv = document.createElement('div');
  monthTitleDiv.classList.add('content-month-title');
  const daysWeekOl = document.createElement('ol');
  daysWeekOl.classList.add('day-of-week');
  const calendarDaysOl = document.createElement('ol');
  calendarDaysOl.classList.add('days-grid');
  contentMonthDiv.appendChild(monthTitleDiv);
  contentMonthDiv.appendChild(daysWeekOl);
  contentMonthDiv.appendChild(calendarDaysOl);
  monthDiv.appendChild(contentMonthDiv);

  return monthDiv;
}

function createMultipYearLayout() {
  const yearDiv = document.createElement('div');
  yearDiv.classList.add('calendar-multi-year');
  const contentYearDiv = document.createElement('div');
  contentYearDiv.classList.add('content-multi-year');
  const yearTitleDiv = document.createElement('div');
  yearTitleDiv.classList.add('content-year-title');
  const yearsOl = document.createElement('ol');
  yearsOl.classList.add('years-container');
  contentYearDiv.appendChild(yearTitleDiv);
  contentYearDiv.appendChild(yearsOl);
  yearDiv.appendChild(contentYearDiv);

  return yearDiv;
}

function createMonthLayout() {
  const monthDiv = document.createElement('div');
  monthDiv.classList.add('calendar-month-layout');
  const contentMonthDiv = document.createElement('div');
  contentMonthDiv.classList.add('content-month-layout');
  const monthTitleDiv = document.createElement('div');
  monthTitleDiv.classList.add('content-month-layout-title');
  const monthsOl = document.createElement('ol');
  monthsOl.classList.add('month-layout-container');
  MONTHS.forEach((item) => {
    const monthItem = document.createElement('li');
    monthItem.classList.add('month-item');
    monthItem.textContent = item.text;
    monthItem.setAttribute('value', item.value);
    monthsOl.appendChild(monthItem);
  });
  contentMonthDiv.appendChild(monthTitleDiv);
  contentMonthDiv.appendChild(monthsOl);
  monthDiv.appendChild(contentMonthDiv);

  return monthDiv;
}

export class CdgDatePicker extends HTMLElement {
  selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
  mode = 'day';
  containerElement;
  calendarMonthElement;

  dayView;
  selectedYear;
  multiYearView;
  rangeYear;
  monthView;

  isDouble;

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.append(templateHeader.content.cloneNode(true));

    this.containerElement = document.createElement('div');
    this.containerElement.classList.add('calendar-container');
    this.appendChild(this.containerElement);
    this.containerElement.appendChild(createDayLayout());
    this.dayView = this.containerElement.querySelector('#content-month');
    this.calendarMonthElement = this.querySelector('#calendar-month');

    this.isDouble = this.hasAttribute('double');
    if (this.isDouble) {
      this.style.width = '630px';
      this.containerElement.appendChild(createDayLayout());
    } else {
      this.style.width = '327px';
    }
    this.render();
  }

  connectedCallback() {
    this.classList.add('cdg-datepicker');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
  }

  createCalendar(year = INITIAL_YEAR, month = INITIAL_MONTH) {
    const calendarDaysElements = this.getElementsByClassName('days-grid');

    for (let index = 0; index < calendarDaysElements.length; index++) {
      const calendarDaysElement = calendarDaysElements.item(index);
      const currentMonth = Number(month) + index;
      this.contentMonthTitleElement = this.calendarMonthElement.querySelector(
        '.content-month-title'
      );
      if (this.contentMonthTitleElement) {
        this.contentMonthTitleElement.innerText = dayjs(
          new Date(year, currentMonth - 1)
        ).format('MMMM YYYY');
        if (!this.isDouble && index === 0) {
          if (!this.titleDayClickFn) {
            this.titleDayClickFn = this.handleTitleDayClick.bind(this);
          }
          this.contentMonthTitleElement.addEventListener(
            'click',
            this.titleDayClickFn
          );
        }
      }

      this.removeAllDayElements(calendarDaysElement);
      const currentMonthDays = this.createDaysForCurrentMonth(
        year,
        currentMonth
      );
      const previousMonthDays = this.createDaysForPreviousMonth(
        year,
        currentMonth,
        currentMonthDays
      );
      const nextMonthDays = this.createDaysForNextMonth(
        year,
        currentMonth,
        currentMonthDays,
        currentMonthDays.length + previousMonthDays.length
      );
      // Create list days with 6 rows x 7 columns
      const days = [
        ...previousMonthDays,
        ...currentMonthDays,
        ...nextMonthDays,
      ];
      days.forEach((day) => {
        this.appendDay(day, calendarDaysElement);
      });
    }
  }

  appendDay(day, calendarDaysElement) {
    const dayElement = document.createElement('li');
    const dayElementClassList = dayElement.classList;
    dayElementClassList.add('calendar-day');
    const dayOfMonthElement = document.createElement('span');
    dayOfMonthElement.innerText = day.dayOfMonth;
    dayElement.appendChild(dayOfMonthElement);
    calendarDaysElement.appendChild(dayElement);
    if (!day.isCurrentMonth) {
      dayElementClassList.add('calendar-day--not-current');
    }
    if (day.date === TODAY) {
      dayElementClassList.add('calendar-day--today');
    }
  }

  handleTitleDayClick() {
    // Switching layout from dayView to multi year view
    this.mode = 'year';
    this.calendarMonthElement.removeChild(this.dayView);
    this.multiYearView = createMultipYearLayout();
    this.calendarMonthElement.appendChild(this.multiYearView);

    // Create range to display items multi year
    this.rangeYear = Math.floor(
      this.selectedMonth.format('YYYY') / DISPLAY_YEARS_LENGTH
    );
    const currentYear = `${this.rangeYear * DISPLAY_YEARS_LENGTH} - ${
      (this.rangeYear + 1) * DISPLAY_YEARS_LENGTH - 1
    }`;
    const contentYearTitleElement = this.multiYearView.querySelector(
      '.content-year-title'
    );
    if (contentYearTitleElement) {
      contentYearTitleElement.innerHTML = currentYear;
      contentYearTitleElement.addEventListener(
        'click',
        this.handleContentYearTitleClick.bind(this)
      );
    }
    this.createYear.bind(this)();
  }

  handleContentYearTitleClick() {
    // Switching layout from multi year view to dayView
    this.mode = 'day';
    this.calendarMonthElement.removeChild(this.multiYearView);
    this.calendarMonthElement.appendChild(this.dayView);
  }

  createYear() {
    this.removeAllDayElements(
      this.multiYearView.querySelector('.years-container')
    );
    const contentYearTitleElement = this.multiYearView.querySelector(
      '.content-year-title'
    );
    const currentYear = `${this.rangeYear * DISPLAY_YEARS_LENGTH} - ${
      (this.rangeYear + 1) * DISPLAY_YEARS_LENGTH - 1
    }`;
    contentYearTitleElement.innerHTML = currentYear;

    for (let index = 0; index < DISPLAY_YEARS_LENGTH; index++) {
      const yearText = index + this.rangeYear * DISPLAY_YEARS_LENGTH;
      const yearElement = document.createElement('li');
      yearElement.innerText = yearText;
      yearElement.addEventListener(
        'click',
        this.handleYearItemClick.bind(this)
      );
      // Add content
      this.multiYearView
        .querySelector('.years-container')
        .appendChild(yearElement);
    }
  }

  handleYearItemClick(event) {
    const yearText = event.target.innerText;
    this.selectedYear = Number(yearText);
    this.selectedMonth = dayjs(this.selectedMonth).year(yearText);

    // Switching layout from multi year view to monthView
    this.mode = 'month';
    this.monthView = createMonthLayout();
    this.calendarMonthElement.removeChild(this.multiYearView);
    this.calendarMonthElement.appendChild(this.monthView);

    const contentMonthTitleElement = this.monthView.querySelector(
      '.content-month-layout-title'
    );
    if (contentMonthTitleElement) {
      contentMonthTitleElement.innerHTML = this.selectedYear;
      contentMonthTitleElement.addEventListener(
        'click',
        this.handleContentMonthTitleClick.bind(this)
      );
    }

    const contentMonthItemElements =
      this.monthView.querySelectorAll('.month-item');
    if (contentMonthItemElements) {
      if (!this.monthItemClickFn) {
        this.monthItemClickFn = this.handleMonthItemClick.bind(this);
      }
      contentMonthItemElements.forEach((item) => {
        item.addEventListener('click', this.monthItemClickFn);
      });
    }
  }

  handleContentMonthTitleClick() {
    // Switching layout from monthView to dayView
    this.mode = 'day';
    this.calendarMonthElement.removeChild(this.monthView);
    this.calendarMonthElement.appendChild(this.dayView);
    this.createCalendar(this.selectedYear);
  }

  handleMonthItemClick(event) {
    // Switching layout from monthView to dayView
    this.mode = 'day';
    this.calendarMonthElement.removeChild(this.monthView);
    this.calendarMonthElement.appendChild(this.dayView);

    // Re-render calendar with selected year and month
    this.selectedMonth = dayjs(this.selectedMonth)
      .year(this.selectedYear)
      .month(event.target.getAttribute('value'));
    this.createCalendar(
      this.selectedMonth.format('YYYY'),
      this.selectedMonth.format('M')
    );
  }

  createDaysForCurrentMonth(year, month) {
    return [...Array(this.getNumberOfDaysInMonth(year, month))].map(
      (_, index) => {
        return {
          date: dayjs(`${year}-${month}-${index + 1}`).format('YYYY-MM-DD'),
          dayOfMonth: index + 1,
          isCurrentMonth: true,
        };
      }
    );
  }

  createDaysForPreviousMonth(year, month, currentMonthDays) {
    // Get first weekday of current month: sun = 0, sat = 6
    const firstDayOfTheMonthWeekday = this.getWeekday(currentMonthDays[0].date);
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
      ? firstDayOfTheMonthWeekday
      : 0;

    const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
      .subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
      .date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((_, index) => {
      return {
        date: dayjs(
          `${previousMonth.year()}-${previousMonth.month() + 1}-${
            previousMonthLastMondayDayOfMonth + index
          }`
        ).format('YYYY-MM-DD'),
        dayOfMonth: previousMonthLastMondayDayOfMonth + index,
        isCurrentMonth: false,
      };
    });
  }

  createDaysForNextMonth(year, month, currentMonthDays, currentLength) {
    let lastDayOfTheMonthWeekday = this.getWeekday(
      `${year}-${month}-${currentMonthDays.length}`
    );
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
    let visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
      ? DISPLAY_WEEKDAYS_LENGTH - lastDayOfTheMonthWeekday
      : lastDayOfTheMonthWeekday;

    const isNeedNextMonth =
      (currentLength + visibleNumberOfDaysFromNextMonth) /
        DISPLAY_WEEKDAYS_LENGTH <=
      5;

    if (!isNeedNextMonth) {
      visibleNumberOfDaysFromNextMonth +=
        42 - (currentLength + visibleNumberOfDaysFromNextMonth);
    }

    return [
      ...Array(
        visibleNumberOfDaysFromNextMonth +
          (isNeedNextMonth ? DISPLAY_WEEKDAYS_LENGTH : 0)
      ),
    ].map((_, index) => {
      return {
        date: dayjs(
          `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
        ).format('YYYY-MM-DD'),
        dayOfMonth: index + 1,
        isCurrentMonth: false,
      };
    });
  }

  removeAllDayElements(calendarDaysElement) {
    let first = calendarDaysElement.firstElementChild;
    while (first) {
      first.remove();
      first = calendarDaysElement.firstElementChild;
    }
  }

  getNumberOfDaysInMonth(year, month) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
  }

  getWeekday(date) {
    return dayjs(date).weekday();
  }

  initMonthSelectors() {
    const previousMonthSelector = this.querySelector(
      '.previous-month-selector'
    );

    if (previousMonthSelector) {
      previousMonthSelector.addEventListener(
        'click',
        this.handlePreviousButtonClick.bind(this)
      );
    }
    // this
    //   .getElementById("present-month-selector")
    //   .addEventListener("click", function () {
    //     this.selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
    //     createCalendar(this.selectedMonth.format("YYYY"), this.selectedMonth.format("M"));
    //   });
    const nextMonthSelector = this.querySelector('.next-month-selector');
    if (nextMonthSelector) {
      nextMonthSelector.addEventListener(
        'click',
        this.handleNextMonthButtonClick.bind(this)
      );
    }
  }

  handlePreviousButtonClick() {
    switch (this.mode) {
      case 'day':
        this.selectedMonth = dayjs(this.selectedMonth).subtract(1, 'month');
        this.createCalendar(
          this.selectedMonth.format('YYYY'),
          this.selectedMonth.format('M')
        );
        break;
      case 'month':
        this.selectedYear = this.selectedYear - 1;
        const contentMonthTitleElement = this.monthView.querySelector(
          '.content-month-layout-title'
        );
        if (contentMonthTitleElement) {
          contentMonthTitleElement.innerHTML = this.selectedYear;
        }
        break;
      case 'year':
        this.rangeYear = this.rangeYear - 1;
        this.createYear();
        break;

      default:
        break;
    }
  }

  handleNextMonthButtonClick() {
    switch (this.mode) {
      case 'day':
        this.selectedMonth = dayjs(this.selectedMonth).add(1, 'month');
        this.createCalendar(
          this.selectedMonth.format('YYYY'),
          this.selectedMonth.format('M')
        );
        break;
      case 'month':
        this.selectedYear = this.selectedYear + 1;
        const contentMonthTitleElement = this.monthView.querySelector(
          '.content-month-layout-title'
        );
        if (contentMonthTitleElement) {
          contentMonthTitleElement.innerHTML = this.selectedYear;
        }
        break;
      case 'year':
        this.rangeYear = this.rangeYear + 1;
        this.createYear();
        break;

      default:
        break;
    }
  }

  render() {
    const daysOfWeekElements = this.getElementsByClassName('day-of-week');
    for (let index = 0; index < daysOfWeekElements.length; index++) {
      const daysOfWeekElement = daysOfWeekElements.item(index);
      WEEKDAYS.forEach((weekday) => {
        const weekDayElement = document.createElement('li');
        daysOfWeekElement.appendChild(weekDayElement);
        weekDayElement.innerText = weekday;
      });
    }
    this.createCalendar();
    this.initMonthSelectors();
  }
}
