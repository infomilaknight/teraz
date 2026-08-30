/**
 * Teraz — collapse the product detail panels into tabs.
 *
 * The markup ships every panel visible and stacked, which is a correct, readable page on its
 * own. This only layers tabs on top, so a failure here degrades to "all content shown"
 * rather than to "content hidden with no way to reach it".
 *
 * A single tab is not a tab — with only one panel the bar is dropped and the panel is left
 * open, because a lone tab is noise.
 */
export function initProductTabs() {
    document.querySelectorAll('[data-tz-tabs]').forEach((root) => {
        const tabs = Array.from(root.querySelectorAll('[data-tz-tab]'));
        const panels = Array.from(root.querySelectorAll('[data-tz-panel]'));
        if (!tabs.length || !panels.length) return;

        if (tabs.length < 2) {
            root.querySelector('.tz-tabs__bar')?.remove();
            panels.forEach((p) => p.classList.add('is-open'));
            return;
        }

        root.classList.add('is-enhanced');

        const select = (key) => {
            tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tzTab === key)));
            panels.forEach((p) => p.classList.toggle('is-open', p.dataset.tzPanel === key));
        };

        tabs.forEach((tab) => tab.addEventListener('click', () => select(tab.dataset.tzTab)));

        // arrow keys move between tabs, as a tablist is expected to
        root.querySelector('.tz-tabs__bar')?.addEventListener('keydown', (e) => {
            const i = tabs.indexOf(document.activeElement);
            if (i === -1) return;
            const step = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
            if (!step) return;
            e.preventDefault();
            const next = tabs[(i + step + tabs.length) % tabs.length];
            next.focus();
            select(next.dataset.tzTab);
        });

        select(tabs[0].dataset.tzTab);
    });
}
