
class Carousel {
  constructor(params) {
    let settings = this._initConfig(params);

    this.container = document.querySelector(settings.containerID);
    this.slideItems = this.container.querySelectorAll(settings.slideID);
    this.interval = settings.interval;
  }

  _initConfig(o) {

    
      let settings = {
        containerID: '#carousel',
        interval: 5000,
        slideID: '.slide'
      };
     
      if (typeof o !== 'undefined') {
        settings.containerID = o.containerID || settings.containerID;
        settings.interval = o.interval || settings.interval;
        settings.slideID = o.slideID || settings.slideID;
      }
     
    

    const p = {containerID: '#carousel', interval: 5000, slideID: '.slide'};

    return {...p, ...o};
  }

  
  _initProps() {
    this.slidesCount = this.slideItems.length;
    this.currentSlide = 0;
    this.isPlaying = true;

    this.KEY_SPACE = ' ';
    this.KEY_LEFT_ARROW = 'ArrowLeft';
    this.KEY_RIGHT_ARROW = 'ArrowRight';
    this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
  }

  
  _initControls() {
    let controls = document.createElement('div');
    const PAUSE = `<span id="pause-btn" class="control-pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span id="prev-btn" class="control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control-next">${this.FA_NEXT}</span>`;

    controls.setAttribute('class', 'controls');
    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.appendChild(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.nextBtn = this.container.querySelector('#next-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
  }

  
  _initIndicators() {
    let indicators = document.createElement('ol');

    indicators.setAttribute('class', 'indicators');

    for (let i = 0, n = this.slidesCount; i < n; i++) {
      let indicator = document.createElement('li');

      indicator.setAttribute('class', 'indicator');
      indicator.dataset.slideTo = `${i}`;
      i === 0 && indicator.classList.add('active');
      indicators.appendChild(indicator);
    }
    this.container.appendChild(indicators);

    this.indicatorsContainer = this.container.querySelector('.indicators');
    this.indicatorItems = this.container.querySelectorAll('.indicator');
  }

  
  _initListeners() {
    document.addEventListener('keydown', this._keyPress.bind(this));
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));
  }

  
  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.slidesCount) % this.slidesCount;
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
  }

  
  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  
  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  
  _pause() {
    if (this.isPlaying) {
      this.pauseBtn.innerHTML = this.FA_PLAY;
      this.isPlaying = !this.isPlaying;
      clearInterval(this.timerID);
    }
  }

  
  _play() {
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.isPlaying = !this.isPlaying;
    this.timerID = setInterval(() => this._gotoNext(), this.interval);
  }

  
  _indicate(e) {
    let target = e.target;

    if (target.classList.contains('indicator')) {
      this._pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  }

  
  _keyPress(e) {
    if (e.key === this.KEY_LEFT_ARROW) this.prev();
    if (e.key === this.KEY_RIGHT_ARROW) this.next();
    if (e.key === this.KEY_SPACE) this.pausePlay();
  }

  
  pausePlay() {
    this.isPlaying ? this._pause() : this._play();
  }

  
  next() {
    this._pause();
    this._gotoNext();
  }

  
  prev() {
    this._pause();
    this._gotoPrev();
  }

  
  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    this.timerID = setInterval(() => this._gotoNext(), this.interval);
  }
}

class SwipeCarousel extends Carousel {

  

  _initListeners() {
    super._initListeners(); 
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
  }

  
  _swipeStart(e) {
    this.swipeStartX = e.changedTouches[0].pageX;
  }


  _swipeEnd(e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    this.swipeStartX - this.swipeEndX > 100 && this.next();
    this.swipeStartX - this.swipeEndX < -100 && this.prev();
  }
}
