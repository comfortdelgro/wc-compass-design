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
  pillBadges: './components/pill-badges.html',
  status: './components/status.html',
  actionBar: './components/action-bar.html',
  tabs: './components/tabs.html',
  textField: './components/text-field.html',
};

const scriptMap = {
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
  const lastPrams = url.split('#')[1] || 'default';
  const hash = lastPrams.split('?')[0];
  activeMenu(hash);

  downloadHTMLContent(contentMap[hash]).then((data) => {
    content.innerHTML = data;
  });

  // Wait for content render
  setTimeout(() => {
    scriptElement.setAttribute('src', scriptMap[hash] || '');
    hljs.highlightAll();
  }, 100);
}

window.addEventListener('hashchange', function (event) {
  handlePageChange(event.newURL);
});

document.onreadystatechange = () => handlePageChange(window.location.href);
