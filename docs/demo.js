import './pages/home.html';
import './components/accordion.html';
import './components/alert.html';
import './components/alert-badges.html';
import './components/avatar.html';
import './components/breadcrumbs.html';
import './components/checkboxes.html';
import './components/dashboard-side-card.html';
import './components/footer.html';
import './components/icon.html';
import './components/button.html';
import './components/cards.html';
import './components/carousel.html';
import './components/inline-loading.html';
import './components/list-view.html';
import './components/loading.html';
import './components/nav-rail.html';
import './components/navbar.html';
import './components/page-header.html';
import './components/pagination.html';
import './components/pill-badges.html';
import './components/radios.html';
import './components/status.html';
import './components/action-bar.html';
import './components/sub-header.html';
import './components/tabs.html';
import './components/text-field.html';
import './components/table.html';
import './components/dropdown.html';
import './components/popover.html';
import './components/progress.html';
import './components/toggle.html';
import './components/wizards.html';
import './components/calendar.html';
import './components/datepicker.html';

function downloadHTMLContent(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { cache: 'no-cache' })
      .then((response) => response.text())
      .then((data) => {
        if (data) {
          resolve(data);
        } else {
          reject(new Error('Loaded file is not valid HTML File"'));
        }
      })
      .catch(() => {
        reject(new Error('Error loading HTML'));
      });
  });
}

const contentMap = {
  default: './pages/home.html',
  home: './pages/home.html',
  accordion: './components/accordion.html',
  alert: './components/alert.html',
  alertBadges: './components/alert-badges.html',
  avatar: './components/avatar.html',
  breadcrumbs: './components/breadcrumbs.html',
  checkboxes: './components/checkboxes.html',
  dashboardSideCard: './components/dashboard-side-card.html',
  footer: './components/footer.html',
  icon: './components/icon.html',
  dropdown: './components/dropdown.html',
  button: './components/button.html',
  cards: './components/cards.html',
  carousel: './components/carousel.html',
  inlineLoading: './components/inline-loading.html',
  listView: './components/list-view.html',
  loading: './components/loading.html',
  navRail: './components/nav-rail.html',
  navbar: './components/navbar.html',
  pageHeader: './components/page-header.html',
  pagination: './components/pagination.html',
  pillBadges: './components/pill-badges.html',
  radios: './components/radios.html',
  status: './components/status.html',
  actionBar: './components/action-bar.html',
  subHeader: './components/sub-header.html',
  tabs: './components/tabs.html',
  textField: './components/text-field.html',
  table: './components/table.html',
  popover: './components/popover.html',
  progress: './components/progress.html',
  toggle: './components/toggle.html',
  wizards: './components/wizards.html',
  calendar: './components/calendar.html',
  datepicker: './components/datepicker.html',
};

const content = document.querySelector('#component-content');
const scriptElement = document.querySelector('#sample-script');

let activatedMenu = null;

function activeMenu(hash) {
  if (activatedMenu) {
    activatedMenu.forEach((element) => {
      element.classList.remove('active');
    });
  }

  activatedMenu = document.querySelectorAll('[href="#' + hash + '"]');
  activatedMenu.forEach((element) => {
    element.classList.add('active');
  });

  // Close menu
  document.querySelector('cdg-nav-rail').open = false;
}

function handlePageChange(url) {
  // Remove old script
  scriptElement.textContent = '';

  const lastPrams = url.split('#')[1] || 'default';
  const hash = lastPrams.split('?')[0];
  activeMenu(hash);

  downloadHTMLContent(contentMap[hash]).then((data) => {
    content.innerHTML = data;

    // Make demo script works
    const scriptElement = content.querySelector('script');
    if (scriptElement) {
      eval(scriptElement.innerHTML);
    }

    // Wait for content render
    setTimeout(() => {
      hljs.highlightAll();
    }, 10);
  });
}

window.addEventListener('hashchange', function (event) {
  handlePageChange(event.newURL);
});

document.onreadystatechange = () => handlePageChange(window.location.href);
