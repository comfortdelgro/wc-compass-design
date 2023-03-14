import { toDisplayTime } from './video.util';

const CONTROLS_TEMPLATE = `
<div class="video-time-control">
    <span class="current-time">00:00</span>
    <span class="video-progressbar">
        <cdg-range-slider min="0" max="100" hidePopup></cdg-range-slider>
    </span>
    <span class="total-time">00:00</span>
</div>
<div class="video-navigation">
    <button class="cdg-button video-button icon backward" size="small">
        <cdg-icon name="backward" source="host"></cdg-icon>
    </button>
    <button class="cdg-button video-button icon play-pause">
        <cdg-icon name="caretRight" source="host"></cdg-icon>
    </button>
    <button class="cdg-button video-button icon forward" size="small">
        <cdg-icon name="forward" source="host"></cdg-icon>
    </button>
    <button class="cdg-button video-button icon setting" size="small">
        <cdg-icon name="setting" source="host"></cdg-icon>
    </button>
</div>
`;

export class CdgVideoControls extends HTMLElement {
  static get observedAttributes() {
    return ['current-time', 'duration', 'playing', 'buffering'];
  }

  get playing() {
    return this.hasAttribute('playing');
  }

  set playing(playing) {
    if (playing) {
      this.setAttribute('playing', playing);
    } else {
      this.removeAttribute('playing');
    }
  }

  get currentTime() {
    return Number(this.getAttribute('current-time')) || 0;
  }

  set currentTime(currentTime) {
    this.setAttribute('current-time', currentTime);
  }

  get duration() {
    return Number(this.getAttribute('duration')) || 0;
  }

  set duration(duration) {
    this.setAttribute('duration', duration);
  }

  get buffering() {
    return Number(this.getAttribute('buffering'));
  }

  set buffering(buffering) {
    this.setAttribute('buffering', buffering);
  }

  currentTimeElement;
  durationElement;
  seekBar;
  btnPlayPause;
  btnBackward;
  btnForward;
  btnSetting;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-video-controls');
    this.innerHTML = CONTROLS_TEMPLATE;

    this.currentTimeElement = this.querySelector('.current-time');
    this.durationElement = this.querySelector('.total-time');
    this.seekBar = this.querySelector('cdg-range-slider');
    this.seekBar.addEventListener('change', this.handleSeekbar.bind(this));

    this.btnPlayPause = this.querySelector('.play-pause');
    this.btnPlayPause.addEventListener(
      'click',
      this.handlePlayPause.bind(this)
    );

    this.btnBackward = this.querySelector('.backward');
    this.btnBackward.addEventListener('click', this.handleBackward.bind(this));

    this.btnForward = this.querySelector('.forward');
    this.btnForward.addEventListener('click', this.handleForward.bind(this));

    this.btnSetting = this.querySelector('.setting');
    this.btnSetting.addEventListener('click', this.handleSetting.bind(this));
  }

  attributeChangedCallback(attr) {
    switch (attr) {
      case 'current-time':
        if (this.currentTimeElement) {
          this.currentTimeElement.textContent = toDisplayTime(this.currentTime);
        }
        if (this.seekBar && this.duration) {
          this.seekBar.setAttribute(
            'value',
            (this.currentTime / this.duration) * 100
          );
        }
        break;

      case 'duration':
        if (this.durationElement) {
          this.durationElement.textContent = toDisplayTime(this.duration);
        }
        break;

      case 'playing':
        if (this.btnPlayPause) {
          const iconElement = this.btnPlayPause.querySelector('cdg-icon');
          const iconName = this.playing ? 'pause' : 'caretRight';
          iconElement.name = iconName;
        }
        break;

      case 'buffering':
        this.seekBar.buffering = this.buffering;
        break;

      default:
        break;
    }
  }

  handleSeekbar(event) {
    const percent = event.detail.value;
    const target = (this.duration / 100) * percent;
    this.dispatchEvent(new CustomEvent('seek', { detail: target }));
  }

  handlePlayPause() {
    this.dispatchEvent(new CustomEvent('toggle'));
  }

  handleBackward() {
    this.dispatchEvent(new CustomEvent('navigate', { detail: 'previous' }));
  }

  handleForward() {
    this.dispatchEvent(new CustomEvent('navigate', { detail: 'next' }));
  }

  handleSetting() {
    this.dispatchEvent(new CustomEvent('setting'));
  }
}
