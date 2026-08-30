/**
 * Teraz — reveal the hero video only once it can genuinely play.
 *
 * Autoplay is refused on some devices and blocked outright under Low Power Mode, so the
 * video starts transparent over its poster and is only faded in on `canplay`. If it never
 * gets there the poster simply stays, which is a correct hero rather than a fallback.
 */
export function initHeroVideo() {
    document.querySelectorAll('.tz-hero__video').forEach((video) => {
        const reveal = () => video.classList.add('is-playing');

        if (video.readyState >= 3) reveal();
        else video.addEventListener('canplay', reveal, { once: true });

        // Safari can resolve play() as rejected without ever firing an error event
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(() => video.classList.remove('is-playing'));
        }

        // pause off-screen so a long page does not keep decoding frames nobody sees
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(
                ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
                { threshold: 0.1 }
            ).observe(video);
        }
    });
}
