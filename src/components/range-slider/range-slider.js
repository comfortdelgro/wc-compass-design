export class CdgRangeSlider extends HTMLElement {
  constructor() {
    super();

    // Create range slider elements
    this.classList.add('cdg-range-slider');
    const slider = document.createElement('div');
    slider.classList.add('range-slider');

    const thumb = document.createElement('div');
    thumb.classList.add('thumb');
    slider.appendChild(thumb);

    // Attach range slider to root
    this.appendChild(slider);

    // Initialize state
    this.min = this.getAttribute('min') || 0;
    this.max = this.getAttribute('max') || 100;
    this.value = this.getAttribute('value') || 50;
    this.width = slider.offsetWidth - thumb.offsetWidth;
    this.updatePosition();
    thumb.setAttribute("value",this.getAttribute('value'))
    // Bind event listeners
    thumb.addEventListener('mousedown', this.handleMouseDown.bind(this));
    slider.addEventListener('click', this.handleClick.bind(this));
    // let isMouseDown = fasle;
  }
  // Dispatch a custom event with the new value whenever it changes
  dispatchChangeEvent() {
    const event = new CustomEvent('change', {
      bubbles: true,
      detail: {
        value: this.value
      }
    });
    this.dispatchEvent(event);
  }
  // Update thumb position based on current value
  updatePosition() {
    this.querySelector('.thumb').setAttribute("value",this.getAttribute('value'))
    const percent = (this.value - this.min) / (this.max - this.min);
    this.querySelector('.thumb').style.left = percent * this.width + 'px';
    this.dispatchChangeEvent();
  }
  // Handle thumb drag
  handleMouseDown(event) {
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
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }

  // Handle click on slider
  handleClick(event) {
    if(this.isMouseDown){
      this.isMouseDown = false
    }else{
      const percent = event.offsetX / this.width;
      this.value = Math.round(percent * (this.max - this.min) + this.min);
      this.updatePosition();
    }
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
}
