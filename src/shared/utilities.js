export function downloadSVGContent(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { cache: 'force-cache' })
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const result = parser.parseFromString(data, 'text/xml');
        let svgElement = result.getElementsByTagName('svg')[0];
        if (svgElement) {
          resolve(svgElement);
        } else {
          reject(new Error('Loaded file is not valid HTML File"'));
        }
      })
      .catch(() => {
        reject(new Error('Error loading HTML'));
      });
  });
}

export function toLowerCaseAndDash(value) {
  return value.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}
