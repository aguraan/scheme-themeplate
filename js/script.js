AOS.init({
    once: true
});
const isMobile = navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('mobile') >= 0;
const isSmall = window.innerWidth < 1000;
    new ParticleSlider({
        ptlGap: isMobile || isSmall ? 3 : 2, // default 0
        ptlSize: isMobile || isSmall ? 3 : 2, // default 1
        width: 1e9,
        height: 1e9,
        mouseForce: 700
});