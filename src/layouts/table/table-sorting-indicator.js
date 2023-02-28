export class CdgSortingAsc extends HTMLElement {
  constructor() {
    super();
    // Create a new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.getAttribute('width') || '24');
    svg.setAttribute('height', this.getAttribute('height') || '26');
    svg.setAttribute('viewBox', this.getAttribute('viewBox') || '0 0 24 26');

    // Create the first path element
    const path1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    path1.setAttribute('d', this.getAttribute('path1-d') || '');
    path1.setAttribute('fill', this.getAttribute('path1-fill') || '');

    // Create the second path element
    const path2 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    path2.setAttribute('d', this.getAttribute('path2-d') || '');
    path2.setAttribute('fill', this.getAttribute('path2-fill') || '');

    // Append the paths to the SVG element
    svg.appendChild(path1);
    svg.appendChild(path2);

    // Append the SVG to the Custom Element's shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(svg);
  }
}

export class CdgSortingDesc extends HTMLElement {
    constructor() {
      super();
      // Create a new SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', this.getAttribute('width') || '24');
      svg.setAttribute('height', this.getAttribute('height') || '26');
      svg.setAttribute('viewBox', this.getAttribute('viewBox') || '0 0 24 26');
  
      // Create the first path element
      const path1 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path1.setAttribute('d', this.getAttribute('path1-d') || '');
      path1.setAttribute('fill', this.getAttribute('path1-fill') || '');
  
      // Create the second path element
      const path2 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path2.setAttribute('d', this.getAttribute('path2-d') || '');
      path2.setAttribute('fill', this.getAttribute('path2-fill') || '');
  
      // Append the paths to the SVG element
      svg.appendChild(path1);
      svg.appendChild(path2);
  
      // Append the SVG to the Custom Element's shadow DOM
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(svg);
    }
  }
