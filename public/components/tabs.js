let activeIndex = 0;

const tab = document.querySelector('#sample-tab');
const tabContent = document.querySelector('[for="sample-tab"]');

function onSwitchTab(data) {
  tabContent.children[activeIndex].classList.remove('active');
  activeIndex = data.detail;
  tabContent.children[activeIndex].classList.add('active');
}

tab.addEventListener('switchTab', onSwitchTab);
