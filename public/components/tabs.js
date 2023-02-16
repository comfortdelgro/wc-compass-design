function listenTabs() {
  let activeIndex = 0;

  const onSwitchTab = (data) => {
    tabContent.children[activeIndex].classList.remove('active');
    activeIndex = data.detail;
    tabContent.children[activeIndex].classList.add('active');
  };

  const tab = document.querySelector('#sample-tab');
  const tabContent = document.querySelector('[for="sample-tab"]');
  tab.addEventListener('switchTab', onSwitchTab);
}

listenTabs();
