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
import { CdgPagination } from './components/pagination/pagination';
import { CdgPillBadge } from './components/pill-badge/pill-badge';
import { CdgStatus } from './components/status/status';
import { CdgTab } from './components/tab/tab';
import { CdgTabs } from './components/tab/tabs';
import { CdgActionBar } from './layouts';

import { downloadSVGContent, toLowerCaseAndDash } from './shared/utilities';

customElements.define('cdg-accordion', CdgAccordion);
customElements.define('cdg-accordion-header', CdgAccordionHeader);
customElements.define('cdg-accordion-content', CdgAccordionContent);
customElements.define('cdg-alert', CdgAlert);
customElements.define('cdg-alert-badge', CdgAlertBadge);
customElements.define('cdg-alert-content', CdgAlertContent);
customElements.define('cdg-avatar', CdgAvatar);
customElements.define('cdg-icon', CdgIcon);
customElements.define('cdg-inline-loading', CdgInlineLoading);
customElements.define('cdg-pagination', CdgPagination);
customElements.define('cdg-pill-badge', CdgPillBadge);
customElements.define('cdg-status', CdgStatus);
customElements.define('cdg-tab', CdgTab);
customElements.define('cdg-tabs', CdgTabs);

// Layouts
customElements.define('cdg-action-bar', CdgActionBar);

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
  CdgPagination,
  CdgPillBadge,
  CdgStatus,
  CdgTab,
  CdgTabs,
  CdgActionBar,
  downloadSVGContent,
  toLowerCaseAndDash,
  ICONS_IMAGES,
};
