import './pages/home.html';
import './components/accordion.html';
import './components/alert.html';
import './components/alert-badges.html';
import './components/avatar.html';
import './components/breadcrumbs.html';
import './components/icon.html';
import './components/button.html';
import './components/cards.html';
import './components/inline-loading.html';
import './components/pagination.html';
import './components/pill-badges.html';
import './components/status.html';
import './components/action-bar.html';
import './components/tabs.html';
import './components/text-field.html';
import './components/table.html';

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
  icon: './components/icon.html',
  button: './components/button.html',
  cards: './components/cards.html',
  inlineLoading: './components/inline-loading.html',
  pagination: './components/pagination.html',
  pillBadges: './components/pill-badges.html',
  status: './components/status.html',
  actionBar: './components/action-bar.html',
  tabs: './components/tabs.html',
  textField: './components/text-field.html',
  table: './components/table.html',
};

const content = document.querySelector('#component-content');
const scriptElement = document.querySelector('#sample-script');

let activatedMenu = null;

function activeMenu(hash) {
  activatedMenu && activatedMenu.classList.remove('active');
  activatedMenu = document.querySelector('[href="#' + hash + '"]');
  activatedMenu && activatedMenu.classList.add('active');
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
