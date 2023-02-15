import { CdgIconSize } from '../../shared/core.js';
import { downloadSVGContent, toLowerCaseAndDash } from '../../main.js';

export class CdgIcon extends CdgIconSize {
  name = '';

  constructor() {
    super();
    this.classList.add('cdg-icon');

    this.name = this.getAttribute('name');
    this.download('./images/' + toLowerCaseAndDash(this.name) + '.svg');
  }

  download(url) {
    downloadSVGContent(url).then((data) => {
      this.appendChild(data);
    });
  }
}
