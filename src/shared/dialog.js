export class DialogService {
  modals = {};

  show(id, modal) {
    const modalElement = this.wrapByOverlay(modal);
    modal.id = id;
    this.modals[id] = modalElement;
    document.body.appendChild(modalElement);
  }

  hide(id) {
    if (!this.modals[id]) {
      console.error('Can not find this id');
      return;
    }

    this.modals[id].firstElementChild.dispatchEvent(
      new CustomEvent('close', { detail: '' })
    );

    document.body.removeChild(this.modals[id]);
    delete this.modals[id];
  }

  wrapByOverlay(modal) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('cdg-modal-overlay');
    wrapper.appendChild(modal);
    return wrapper;
  }
}
