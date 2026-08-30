/**
 * Teraz — make an unmet required option visible BEFORE the click.
 *
 * theme-raed already relies on native form validation, so a shopper who has not picked a
 * size can still press "add to cart" and only then get bounced by the browser. On a fashion
 * store that is the single biggest source of abandoned carts, so here the state is surfaced
 * up front: while a required option is empty the button is muted and non-clickable, a hint
 * replaces its label, and the offending option group is outlined.
 *
 * Native validation is left completely intact — this only mirrors it into the UI. If the
 * product has no required options, nothing is touched.
 */
export function requireOptionBeforeAdd() {
    const form = document.querySelector('.product-form');
    if (!form) return;

    const options = form.querySelector('salla-product-options');
    if (!options) return;

    const hint = form.querySelector('.tz-option-hint');

    const missingFields = () =>
        Array.from(form.elements).filter((el) => el.willValidate && !el.validity.valid);

    const sync = () => {
        const missing = missingFields();
        form.classList.toggle('tz-needs-option', missing.length > 0);

        // outline only the group that is actually incomplete, not every option on the page
        form.querySelectorAll('.tz-option-missing').forEach((el) => el.classList.remove('tz-option-missing'));
        const first = missing[0];
        if (first) {
            const group = first.closest('.s-product-options-option');
            group?.classList.add('tz-option-missing');
            if (hint) hint.textContent = hintFor(first);
        }
    };

    /** Names the thing that is missing, so the hint reads like a person wrote it. */
    const hintFor = (field) => {
        // salla-product-options renders: .s-product-options-option > label.s-product-options-option-label > b
        const option = field.closest('.s-product-options-option');
        const name = option?.querySelector('.s-product-options-option-label b')
            ?.textContent?.replace('*', '').trim();
        return name
            ? salla.lang.get('pages.products.select_option_first').replace(':option', name)
            : salla.lang.get('pages.products.select_options_first');
    };

    form.addEventListener('change', sync);
    form.addEventListener('input', sync);
    options.addEventListener('changed', () => setTimeout(sync, 50));

    // the options component renders asynchronously, so wait for it before the first read
    const observer = new MutationObserver(() => {
        if (form.elements.length) {
            observer.disconnect();
            sync();
        }
    });
    observer.observe(options, { childList: true, subtree: true });
    setTimeout(sync, 300);
}
