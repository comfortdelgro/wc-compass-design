export class CdgTable extends HTMLElement {
  tableToolbar;
  tableFooter;
  tableContainerElement;
  tableHeadElement;
  tableBodyElement;

  get checkable() {
    return this.hasAttribute('checkable');
  }

  set checkable(value) {
    if (value) {
      this.setAttribute('checkable', '');
      this.tableHeadElement.setAttribute('checkable', '');
      this.tableBodyElement.setAttribute('checkable', '');
    } else {
      this.removeAttribute('checkable');
      this.tableHeadElement.removeAttribute('checkable', '');
      this.tableBodyElement.removeAttribute('checkable', '');
    }
  }

  static get observedAttributes() {
    return ['checkable'];
  }

  constructor() {
    super();

    this.createTableContent();
  }

  createTableContent() {
    this.tableToolbar = this.querySelector('[cdg-table-toolbar]');
    this.tableFooter = this.querySelector('[cdg-table-footer]');
    this.tableContainerElement = document.createElement('div');
    this.tableContainerElement.classList.add('cdg-table-container');
    this.tableHeadElement = this.querySelector('cdg-table-head');
    this.tableHeadElement.addEventListener(
      'onCheckAll',
      this.handleTableHeadCheckAll.bind(this)
    );
    this.tableBodyElement = this.querySelector('cdg-table-body');
    this.tableBodyElement.addEventListener(
      'onRowCheck',
      this.handleTableBodyRowCheck.bind(this)
    );
    this.tableContainerElement.appendChild(this.tableHeadElement);
    this.tableContainerElement.appendChild(this.tableBodyElement);
    this.appendChild(this.tableContainerElement);
    this.appendChild(this.tableFooter);
  }

  handleTableBodyRowCheck() {
    const tableRows = this.tableBodyElement.querySelectorAll('cdg-table-row');
    let isCheckAll = true;
    let hasCheckedRow = false;
    for (let index = 0; index < tableRows.length; index++) {
      const tableRow = tableRows.item(index);
      const tableRowCheckbox = tableRow.querySelector(
        'input[type="checkbox"].cdg-cell-checkbox'
      );
      if (!tableRowCheckbox.checked) {
        isCheckAll = false;
      } else {
        hasCheckedRow = true;
      }
      // Stop loop
      if (!isCheckAll && hasCheckedRow) {
        break;
      }
    }

    const checkboxTableHead = this.tableHeadElement.querySelector(
      'input[type="checkbox"].cdg-head-checkbox'
    );
    if (hasCheckedRow) {
      if (!isCheckAll) {
        checkboxTableHead.indeterminate = true;
        checkboxTableHead.checked = false;
      } else {
        checkboxTableHead.indeterminate = false;
        checkboxTableHead.checked = true;
      }
    } else {
      checkboxTableHead.indeterminate = false;
      checkboxTableHead.checked = false;
    }
  }

  handleTableHeadCheckAll(event) {
    const checked = !!event.detail.checked;
    const checkboxes = this.tableBodyElement.querySelectorAll(
      'input[type="checkbox"].cdg-cell-checkbox'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: false }));
    });
  }

  connectedCallback() {
    this.classList.add('cdg-table');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attr] = this.hasAttribute(attr);
  }
}
