function listenPagination() {
  const simplePaging = document.querySelector('#simple-pagination');
  const paging = document.querySelector('#sample-pagination');
  const paging1 = document.querySelector('#sample-pagination1');

  simplePaging.addEventListener('navigate', (data) => {
    simplePaging.currentPage = data.detail;
  });

  paging.addEventListener('navigate', (data) => {
    paging.currentPage = data.detail;
  });

  paging1.addEventListener('navigate', (data) => {
    paging1.currentPage = data.detail;
  });

  //   function handleNavigate(event) {
  //     console.log(event);
  //   }

  //   paging.onnavigate = handleNavigate;
}

listenPagination();
