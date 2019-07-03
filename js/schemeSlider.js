class SchemeSlider {
    constructor(options) {
        const s = this;
        s.box = options.container;
        s.width = s.box.clientWidth;
        s.height = s.box.clientHeight;
        s.items = options.items || 1;
        s.dir = options.dir;
        s.transition = options.transition;
        s.pause = options.pause;
        s.requestId = null;
        s.timerId = null;
        s.cell = {w : s.width / s.items, h : s.height, ratio : function() {return this.h / this.w}};
        s.imgs = options.imgs;
        s.startingShift = (s.imgs.length * s.cell.w - s.cell.w * s.items) * -1;
        s.allLoaded = new Array(s.imgs.length).fill(false);
        s.track = s.createTrack();
        
        let mouseOver = false;
        window.addEventListener('resize', function() {return s.onResize(s)}, false);
        s.box.addEventListener('mouseenter', function() {
            if (!mouseOver) mouseOver = true;
            if (s.timerId) clearTimeout(s.timerId);
            if (s.requestId) cancelAnimationFrame(s.requestId);
        }, false);
        s.box.addEventListener('mouseleave', function() {
            mouseOver = false;
            s.step();
        }, false);
        s.step();
    }
    step() {
        const s = this;
        s.timerId = setTimeout(function() {
            s.track.style.transition = `transform ${s.transition}ms`;
            s.track.style.transform = `translateX(${s.dir > 0 ? s.startingShift + s.dir * s.cell.w : s.dir * s.cell.w}px)`;
            s.requestId = requestAnimationFrame(() => s.step());
        }, s.pause);
    }
    createTrack() {
        const s = this;
        const track = document.createElement('div');
        track.id = 'track';
        s.createImgs(s.imgs).forEach(img => track.appendChild(img));
        track.style.width = s.imgs.length * s.cell.w + 'px';
        track.style.transform = `translateX(${s.dir > 0 ? s.startingShift : 0}px)`;
        track.addEventListener('transitionend', function() {
            this.style.transition = '';
            this.style.transform = `translateX(${s.dir > 0 ? s.startingShift : 0}px)`;
            for (let i = 0; i < Math.abs(s.dir); i++) {
                this.appendChild(this.removeChild(this.children[0]));
            }
        });
        s.box.appendChild(track);
        return track;
    }
    createImgs(links) {
        const s = this;
        return links.map((link, i) => {
            const img = new Image();
            img.onload = function() {
                s.allLoaded[i] = true;
                s.defineImgSize(img);
            }
            img.src = link;
            img.draggable = false;
            img.style.float = s.dir < 0 ? 'left' : 'right';
            return img;
        });
    }
    onResize(s) {
        if (s.allLoaded.some(item => !item)) return;
        s.width = s.box.clientWidth;
        s.height = s.box.clientHeight;
        s.cell = {w : s.width / s.items, h : s.height, ratio : function() {return this.h / this.w}};
        s.track.style.width = s.imgs.length * s.cell.w + 'px';
        s.startingShift = (s.imgs.length * s.cell.w - s.cell.w * s.items) * -1;
        // if (s.width > s.items * (s.cell.h / s.cell.ratio())) s.items++;
        // if (s.cell.w <= s.cell.h && s.items > 1) s.items--;
        Array.from(s.track.children).forEach(img => {
            s.defineImgSize(img);
        });
    }
    defineImgSize(img) {
        const s = this;
        const imgRatio = img.naturalHeight / img.naturalWidth;
        if (imgRatio >= s.cell.ratio()) {
            img.style.height = s.cell.h + 'px';
            img.style.width = img.height / imgRatio + 'px';
            img.style.paddingLeft = img.style.paddingRight = (s.cell.w - img.width) / 2 + 'px';
            img.style.paddingTop = img.style.paddingBottom = '';
        } else {
            img.style.width = s.cell.w + 'px';
            img.style.height = img.width * imgRatio + 'px';
            img.style.paddingTop = img.style.paddingBottom = (s.cell.h - img.height) / 2 + 'px';
            img.style.paddingLeft = img.style.paddingRight = '';
        }
    }
}

const options = {
    container: document.getElementById('scheme-slider'),
    imgs: [
        'img/scheme-slider/1.jpg',
        'img/scheme-slider/2.jpg',
        'img/scheme-slider/3.jpg',
        'img/scheme-slider/4.jpg',
        'img/scheme-slider/5.jpg',
        'img/scheme-slider/6.jpg',
        'img/scheme-slider/7.jpg',
    ],
    items: 1,
    pause: 3000,
    transition: 500,
    dir: -1
}
const sli = new SchemeSlider(options);