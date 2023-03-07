import './styles/index.scss';
import { ICONS_IMAGES } from './components/icon/icon-resource';

import { CdgIconSize } from './shared/core';
import { CdgAccordion } from './components/accordion/accordion';
import { CdgAccordionHeader } from './components/accordion/accordion-header';
import { CdgAccordionContent } from './components/accordion/accordion-content';
import { CdgAlert } from './components/alert/alert';
import { CdgAlertBadge } from './components/alert-badge/alert-badge';
import { CdgAlertContent } from './components/alert/alert-content';
import { CdgAvatar } from './components/avatar/avatar';
import { CdgIcon } from './components/icon/icon';
import { CdgInlineLoading } from './components/inline-loading/inline-loading';
import { CdgLoading } from './components/loading/loading';
import { CdgPagination } from './components/pagination/pagination';
import { CdgPillBadge } from './components/pill-badge/pill-badge';
import { CdgStatus } from './components/status/status';
import { CdgTab } from './components/tab/tab';
import { CdgTabs } from './components/tab/tabs';
import { CdgDropdown } from './components/dropdown/dropdown';
import { CdgDropdownSelect } from './components/dropdown/dropdown-select';
import { CdgDropdownOption } from './components/dropdown/dropdown-option';
import { CdgFloatingContent } from './components/floating-content/floating-content';
import { CdgPopover } from './components/popover/popover';
import { CdgPopoverContent } from './components/popover/popover-content';
import { CdgProgress } from './components/progress/progress';
import { CdgCalendar } from './components/calendar/calendar';
import { CdgDatePicker } from './components/datepicker/datepicker';
import { CdgListview } from './components/list-view/list-view';
import { CdgListItem } from './components/list-view/list-item';
import {
  CdgActionBar,
  CdgCard,
  CdgCardHeader,
  CdgCardBody,
  CdgCardActions,
  CdgTable,
  CdgTableHead,
  CdgTableBody,
  CdgTableCell,
  CdgTableHeaderCell,
  CdgTableRow,
  CdgSortingAsc,
  CdgSortingDesc,
  CdgCardCover,
  CdgSubHeader,
  CdgPageTitle,
  CdgPageHeader,
  CdgPageHeaderRow,
  CdgPageActions,
  CdgNavbar,
  CdgPortalNavbar,
  CdgNavRail,
  CdgWizards,
  CdgWizardStep,
  CdgDashboardSideCard,
  CdgCardActivity,
  CdgGroupAvatar,
} from './layouts';

import {
  downloadSVGContent,
  toLowerCaseAndDash,
  isElement,
} from './shared/utilities';

customElements.define('cdg-accordion', CdgAccordion);
customElements.define('cdg-accordion-header', CdgAccordionHeader);
customElements.define('cdg-accordion-content', CdgAccordionContent);
customElements.define('cdg-alert', CdgAlert);
customElements.define('cdg-alert-badge', CdgAlertBadge);
customElements.define('cdg-alert-content', CdgAlertContent);
customElements.define('cdg-avatar', CdgAvatar);
customElements.define('cdg-icon', CdgIcon);
customElements.define('cdg-inline-loading', CdgInlineLoading);
customElements.define('cdg-loading', CdgLoading);
customElements.define('cdg-pagination', CdgPagination);
customElements.define('cdg-pill-badge', CdgPillBadge);
customElements.define('cdg-status', CdgStatus);
customElements.define('cdg-tab', CdgTab);
customElements.define('cdg-tabs', CdgTabs);
customElements.define('cdg-dropdown', CdgDropdown);
customElements.define('cdg-dropdown-select', CdgDropdownSelect);
customElements.define('cdg-floating-content', CdgFloatingContent);
customElements.define('cdg-dropdown-option', CdgDropdownOption);
customElements.define('cdg-popover', CdgPopover);
customElements.define('cdg-popover-content', CdgPopoverContent);
customElements.define('cdg-progress', CdgProgress);
customElements.define('cdg-calendar', CdgCalendar);
customElements.define('cdg-datepicker', CdgDatePicker);
customElements.define('cdg-list-view', CdgListview);
customElements.define('cdg-list-item', CdgListItem);

// Layouts
customElements.define('cdg-action-bar', CdgActionBar);
customElements.define('cdg-card', CdgCard);
customElements.define('cdg-card-header', CdgCardHeader);
customElements.define('cdg-card-body', CdgCardBody);
customElements.define('cdg-card-actions', CdgCardActions);

// Layouts
customElements.define('cdg-table', CdgTable);
customElements.define('cdg-table-head', CdgTableHead);
customElements.define('cdg-table-body', CdgTableBody);
customElements.define('cdg-table-cell', CdgTableCell);
customElements.define('cdg-table-header-cell', CdgTableHeaderCell);
customElements.define('cdg-table-row', CdgTableRow);
customElements.define('cdg-sorting-asc', CdgSortingAsc);
customElements.define('cdg-sorting-desc', CdgSortingDesc);
customElements.define('cdg-card-cover', CdgCardCover);
customElements.define('cdg-page-title', CdgPageTitle);
customElements.define('cdg-page-header', CdgPageHeader);
customElements.define('cdg-page-header-row', CdgPageHeaderRow);
customElements.define('cdg-page-actions', CdgPageActions);
customElements.define('cdg-sub-header', CdgSubHeader);
customElements.define('cdg-navbar', CdgNavbar);
customElements.define('cdg-portal-navbar', CdgPortalNavbar);
customElements.define('cdg-nav-rail', CdgNavRail);
customElements.define('cdg-wizards', CdgWizards);
customElements.define('cdg-wizard-step', CdgWizardStep);
customElements.define('cdg-dashboard-side-card', CdgDashboardSideCard);
customElements.define('cdg-card-activity', CdgCardActivity);
customElements.define('cdg-group-avatar', CdgGroupAvatar);

export {
  CdgAccordion,
  CdgAccordionHeader,
  CdgAccordionContent,
  CdgIconSize,
  CdgAlert,
  CdgAlertContent,
  CdgAlertBadge,
  CdgAvatar,
  CdgIcon,
  CdgInlineLoading,
  CdgLoading,
  CdgPagination,
  CdgPageTitle,
  CdgPageHeader,
  CdgPageHeaderRow,
  CdgPageActions,
  CdgPillBadge,
  CdgStatus,
  CdgTab,
  CdgTabs,
  CdgActionBar,
  CdgTable,
  CdgTableHead,
  CdgTableBody,
  CdgTableCell,
  CdgTableHeaderCell,
  CdgTableRow,
  CdgSortingAsc,
  CdgSortingDesc,
  CdgDropdown,
  CdgCard,
  CdgCardHeader,
  CdgCardBody,
  CdgCardActions,
  CdgCardCover,
  CdgSubHeader,
  CdgPortalNavbar,
  CdgNavbar,
  CdgProgress,
  CdgNavRail,
  CdgWizards,
  CdgWizardStep,
  CdgDashboardSideCard,
  CdgCardActivity,
  CdgGroupAvatar,
  CdgListview,
  CdgListItem,
  downloadSVGContent,
  toLowerCaseAndDash,
  ICONS_IMAGES,
  isElement,
};
