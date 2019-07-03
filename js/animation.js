// Array.from(document.getElementsByClassName('button-bold')).forEach(function(button) {
//     const color1 = '#b41c1c', color2 = 'rgba(183, 28, 28, 0.6)';
//     button.addEventListener('mouseenter', forward, false);
//     button.addEventListener('mouseleave', backward, false);
//     function forward() {
//         const b = this;
//         animate({
//             duration: 300,
//             timing: makeEaseOut(quad),
//             draw: function(progress) {
//                 let res = 10 + progress * 80;
//                 b.style.backgroundImage = `linear-gradient(to right, ${color1} ${res}%, ${color2} ${res}%)`;
//             }
//         });
//     }
//     function backward() {
//         const b = this;
//         animate({
//             duration: 150,
//             timing: quad,
//             draw: function(progress) {
//                 let res = 90 + progress * -80;
//                 b.style.backgroundImage = `linear-gradient(to right, ${color1} ${res}%, ${color2} ${res}%)`;
//             }
//         });
//     }
// });

function animate(options) {
    const start = performance.now();
    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / options.duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = options.timing(timeFraction)
        options.draw(progress);
        if (timeFraction < 1) requestAnimationFrame(animate);
    });
}

function linear(timeFraction) {
    return timeFraction;
}

function quad(progress) {
    return Math.pow(progress, 2)
}

function circ(timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction))
}

function back(x, timeFraction) {
    return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
}

function bounce(timeFraction) {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}

function elastic(x, timeFraction) {
    return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
}

function makeEaseOut(timing) {
    return function(timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}

function makeEaseInOut(timing) {
    return function(timeFraction) {
        if (timeFraction < 0.5) return timing(2 * timeFraction) / 2;
        else return (2 - timing(2 * (1 - timeFraction))) / 2;
    }
}