const template = document.createElement('template');
template.innerHTML = `
    <div class="cdg-floating-content-overlay"></div>
`;

function getScrollParent(node) {
  if (node == null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentNode);
  }
}

export class CdgFloatingContent extends HTMLElement {
  _position = 'bottom';
  containerElement;
  childrenNode;

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
    switch (this._position) {
      case 'bottom':
        this.classList.add('bottom');
        break;

      default:
        break;
    }
  }

  static get observedAttributes() {
    return ['opening', 'placement'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-floating-content');
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attr) {
      case 'placement':
        this.position = newValue;
        break;
      case 'opening':
        if (newValue) {
          this.style.height = 'auto';

          if (this.parentElement) {
            const anchorElement = this.parentElement.anchorElement;
            setTimeout(() => {
              this.style.visibility = 'visible';
              this.style.opacity = '1';
              const newPosition = getNewPosition(
                anchorElement,
                this.position,
                this.clientHeight,
                this.clientWidth
              );

              this.style.top = `${newPosition.topPosition}px`;
              this.style.left = `${newPosition.leftPosition}px`;
            }, 0);

            document.body.appendChild(this.parentElement);
          }
        } else {
          this.style.visibility = 'hidden';
          this.style.opacity = '0';
          this.style.height = '0';

          if (this.parentElement) {
            document.body.removeChild(this.parentElement);
          }
        }
        break;

      default:
        break;
    }
  }
}

/**
 * Create a new floating component
 * @param {HTMLElement} anchorElement Origin element
 * @param {boolean} isFullWidth Is full-width with origin
 * @param {string} position Floating position relative to the origin
 * @returns {CdgFloatingContent} Floating element
 */
export function createFloating(
  anchorElement,
  isFullWidth = false,
  position = 'bottom'
) {
  // Create overlay for floating
  const containerElement = document.createElement('div');
  containerElement.setAttribute('class', 'cdg-floating-content-overlay');
  containerElement.anchorElement = anchorElement;

  // Create backdrop for floating
  const backdropElement = document.createElement('div');
  backdropElement.setAttribute('class', 'cdg-floating-content-backdrop');
  backdropElement.addEventListener('click', () => {
    this.removeAttribute('opening');
    this.dispatchEvent(new CustomEvent('onDropdownSelectClose'));
  });

  // Create new floating
  const floatingElement = document.createElement('cdg-floating-content');
  floatingElement.setAttribute('placement', position);
  floatingElement.classList.add(position);

  // 100% width of the origin
  if (isFullWidth) {
    floatingElement.style.width = `${anchorElement.clientWidth}px`;
  }

  floatingElement.appendChild(this);
  //   const newPosition = getNewPosition(
  //     anchorElement,
  //     position,
  //     floatingElement.clientHeight
  //   );
  //   floatingElement.style.top = `${newPosition.topPosition}px`;
  //   floatingElement.style.left = `${newPosition.leftPosition}px`;

  containerElement.appendChild(backdropElement);
  containerElement.append(floatingElement);
  return floatingElement;
}

function getNewPosition(
  anchorElement,
  position,
  currentHeight = 0,
  currentWidth = 0
) {
  let topPosition = 0;
  let leftPosition = 0;
  const nearestScrollParent = getScrollParent(anchorElement);
  const scrollTop = nearestScrollParent?.scrollTop || 0;
  const scrollLeft = nearestScrollParent?.scrollLeft || 0;

  // Set position by placement param
  switch (position) {
    case 'topLeft':
      topPosition = anchorElement.offsetTop - currentHeight - scrollTop;
      leftPosition = anchorElement.offsetLeft - scrollLeft;
      break;
    case 'top':
      topPosition = anchorElement.offsetTop - currentHeight - scrollTop;
      leftPosition =
        anchorElement.offsetLeft + anchorElement.clientWidth / 2 - scrollLeft;
      break;
    case 'topRight':
      topPosition = anchorElement.offsetTop - currentHeight - scrollTop;
      leftPosition =
        anchorElement.offsetLeft + anchorElement.clientWidth - currentWidth;
      break;
    case 'leftTop':
      topPosition = anchorElement.offsetTop - scrollTop;
      leftPosition = anchorElement.offsetLeft - currentWidth - scrollLeft;
      break;
    case 'left':
      topPosition =
        anchorElement.offsetTop + anchorElement.clientHeight / 2 - scrollTop;
      leftPosition = anchorElement.offsetLeft - currentWidth - scrollLeft;
      break;
    case 'leftBottom':
      topPosition =
        anchorElement.offsetTop + anchorElement.clientHeight - scrollTop;
      leftPosition = anchorElement.offsetLeft - currentWidth - scrollLeft;
      break;
    case 'rightTop':
      topPosition = anchorElement.offsetTop - scrollTop;
      leftPosition =
        anchorElement.offsetLeft + anchorElement.clientWidth - scrollLeft;
      break;
    case 'right':
      topPosition =
        anchorElement.offsetTop + anchorElement.clientHeight / 2 - scrollTop;
      leftPosition =
        anchorElement.offsetLeft + anchorElement.clientWidth - scrollLeft;
      break;
    case 'rightBottom':
      topPosition =
        anchorElement.offsetTop + anchorElement.clientHeight - scrollTop;
      leftPosition =
        anchorElement.offsetLeft + anchorElement.clientWidth - scrollLeft;
      break;
    case 'bottomLeft':
      topPosition =
        anchorElement.offsetTop + anchorElement.clientHeight - scrollTop;
      leftPosition = anchorElement.offsetLeft - scrollLeft;
      break;
    case 'bottom':
      topPosition =
        anchorElement.offsetTop + anchorElement.clientHeight - scrollTop;
      leftPosition =
        anchorElement.offsetLeft + anchorElement.clientWidth / 2 - scrollLeft;
      break;
    case 'bottomRight':
      topPosition =
        anchorElement.offsetTop + anchorElement.clientHeight - scrollTop;
      leftPosition =
        anchorElement.offsetLeft + anchorElement.clientWidth - scrollLeft;
      break;

    default:
      break;
  }
  return { topPosition, leftPosition };
}
