export class CdgRangeSlider extends HTMLElement {
  get width() {
    return this.offsetWidth - this.thumb.offsetWidth;
  }

  // Define getters and setters for value, min, and max attributes
  get value() {
    return Number(this.getAttribute('value'));
  }
  set value(val) {
    this.setAttribute('value', val);
  }
  get min() {
    return Number(this.getAttribute('min'));
  }
  set min(val) {
    this.setAttribute('min', val);
  }
  get max() {
    return Number(this.getAttribute('max'));
  }
  set max(val) {
    this.setAttribute('max', val);
  }

  thumb;
  slider;
  constructor() {
    super();

    // Create range slider elements
    this.classList.add('cdg-range-slider');
    this.tabIndex = 0;

    this.slider = document.createElement('div');
    this.slider.classList.add('range-slider');

    this.thumb = document.createElement('div');
    this.thumb.classList.add('thumb');
    this.slider.appendChild(this.thumb);

    // Attach range slider to root
    this.appendChild(this.slider);

    // Initialize state
    this.min = this.getAttribute('min') || 0;
    this.max = this.getAttribute('max') || 100;
    this.value = this.getAttribute('value') || 50;
    this.updatePosition();
    this.thumb.setAttribute('value', this.getAttribute('value'));
    // Bind event listeners
    this.thumb.addEventListener('pointerdown', this.handleMouseDown.bind(this));
    this.addEventListener('click', this.handleClick.bind(this));
    // let isMouseDown = fasle;
  }

  // Dispatch a custom event with the new value whenever it changes
  dispatchChangeEvent() {
    const event = new CustomEvent('change', {
      bubbles: true,
      detail: {
        value: this.value,
      },
    });
    this.dispatchEvent(event);
  }

  // Update thumb position based on current value
  updatePosition() {
    this.thumb.setAttribute('value', this.getAttribute('value'));
    const percent = (this.value - this.min) / (this.max - this.min);
    this.slider.style.width = percent * this.width + 'px';
    this.dispatchChangeEvent();
  }

  // Handle thumb drag
  handleMouseDown(event) {
    this.thumb.setPointerCapture(event.pointerId);
    this.isMouseDown = true;
    const startX = event.clientX;
    const thumbX = this.querySelector('.thumb').offsetLeft;
    const moveHandler = (event) => {
      const deltaX = event.clientX - startX;
      const newThumbX = Math.min(Math.max(thumbX + deltaX, 0), this.width);
      const percent = newThumbX / this.width;
      this.value = Math.round(percent * (this.max - this.min) + this.min);
      this.updatePosition();
    };
    const upHandler = () => {
      document.removeEventListener('pointermove', moveHandler);
      document.removeEventListener('pointerup', upHandler);
    };
    document.addEventListener('pointermove', moveHandler);
    document.addEventListener('pointerup', upHandler);
  }

  // Handle click on slider
  handleClick(event) {
    if (this.isMouseDown) {
      this.isMouseDown = false;
    } else {
      const percent = event.offsetX / this.width;
      this.value = Math.round(percent * (this.max - this.min) + this.min);
      this.updatePosition();
    }
  }
}
