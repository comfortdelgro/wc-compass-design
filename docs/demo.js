import './pages/home.html';
import './components/accordion.html';
import './components/alert.html';
import './components/alert-badges.html';
import './components/avatar.html';
import './components/breadcrumbs.html';
import './components/icon.html';
import './components/button.html';
import './components/inline-loading.html';
import './components/pagination.html';
import './components/pill-badges.html';
import './components/status.html';
import './components/action-bar.html';
import './components/tabs.html';
import './components/text-field.html';

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
  inlineLoading: './components/inline-loading.html',
  pagination: './components/pagination.html',
  pillBadges: './components/pill-badges.html',
  status: './components/status.html',
  actionBar: './components/action-bar.html',
  tabs: './components/tabs.html',
  textField: './components/text-field.html',
};

const scriptMap = {
  pagination: './components/pagination.js',
  tabs: './components/tabs.js',
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
    // Wait for content render
    setTimeout(() => {
      const script = document.createElement('script');
      script.setAttribute('src', scriptMap[hash] || '');
      scriptElement.appendChild(script);
      hljs.highlightAll();
    }, 10);
  });
}

window.addEventListener('hashchange', function (event) {
  handlePageChange(event.newURL);
});

document.onreadystatechange = () => handlePageChange(window.location.href);
