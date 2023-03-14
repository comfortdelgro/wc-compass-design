export class CdgVideoPlayer extends HTMLElement {
  video;
  controls;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('cdg-video-player');
    this.video = this.querySelector('video');
    this.video.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    this.video.addEventListener('progress', this.handleProgress.bind(this));
    this.video.addEventListener('suspend', this.handleSuspend.bind(this));
    this.attachControls();
  }

  attachControls() {
    this.controls = document.createElement('cdg-video-controls');
    this.controls.addEventListener('seek', this.handleSeek.bind(this));
    this.controls.addEventListener('toggle', this.handleToggle.bind(this));
    this.controls.addEventListener('navigate', this.handleNavigate.bind(this));
    this.appendChild(this.controls);
  }

  handleTimeUpdate(event) {
    this.controls.currentTime = this.video.currentTime;
    this.controls.duration = this.video.duration;
  }

  handleSeek(event) {
    this.video.currentTime = event.detail;
  }

  handleToggle() {
    if (this.video.paused) {
      this.video.play();
      this.controls.playing = true;
    } else {
      this.video.pause();
      this.controls.playing = false;
    }

    this.dispatchEvent(
      new CustomEvent('play', { detail: this.controls.playing })
    );
  }

  handleProgress() {
    if (this.video.paused) {
      return;
    }

    this.controls.buffering =
      (this.video.buffered.end(0) / this.video.duration) * 100;
  }

  handleSuspend(event) {
    // console.log(event);
  }

  handleNavigate(event) {
    this.dispatchEvent(new CustomEvent('navigate', { detail: event.detail }));
  }
}
