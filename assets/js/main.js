const slides = document.querySelectorAll('.slide');
const indicatorsContainer = document.querySelector('#indicators');
const indicators = document.querySelectorAll('.indicator');
const pauseBtn = document.querySelector('#btn-pause');
const nextBtn = document.querySelector('#btn-next');
const prevBtn = document.querySelector('#btn-prev');

let currentSlide = 0;
let interval = 2000;
let slidesCount = slides.length;
let intervalID = null;
let isPlaying = true;

const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';
const SPACE = 'Space';
const FA_PAUSE = '&#10074;&#10074;';
const FA_PLAY = '&#9658;'


function goToSlide(n) {
    slides[currentSlide].classList.toggle('active');
    indicators[currentSlide].classList.toggle('active');
    currentSlide = (n + slidesCount) % slidesCount;
    indicators[currentSlide].classList.toggle('active');
    slides[currentSlide].classList.toggle('active');
}

function gotoPrev () {
    goToSlide(currentSlide - 1);
}

function gotoNext() {
    goToSlide(currentSlide + 1);

}


function play() {
    intervalID = setInterval(gotoNext, interval);
    pauseBtn.innerHTML = FA_PAUSE;
    isPlaying = true;
}

function pause() {
    if (isPlaying) {
    clearInterval(intervalID);
    pauseBtn.innerHTML = FA_PLAY;
    isPlaying = false;
    }
}

const pausePlay = () => isPlaying ? pause() : play();

function prev() {
    pause();
    gotoPrev();
}

function next() {
    pause();
    gotoNext();
}

function indicate(e) {
    let target = e.target;
    
    if (target.classList.contains('indicator')) {
        pause();
        goToSlide(+target.getAttribute('data-slide-to'));
    }
}

function pressKey(e) {
    if (e.code === LEFT_ARROW) prev();
    if (e.code === RIGHT_ARROW) next();
    if (e.code === SPACE) pausePlay();
}


pauseBtn.addEventListener('click', pausePlay);
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
indicatorsContainer.addEventListener('click', indicate);
document.addEventListener('keydown', pressKey);

intervalID = setInterval(gotoNext, interval);

