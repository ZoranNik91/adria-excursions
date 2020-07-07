const el_lang = document.querySelector('.Menu-lang');
const lang_default = 'en';
const url = new URL(window.location);

let lang = lang_default; // if no hash esists, default to 'en'
if (url.searchParams.get('l')) lang = url.searchParams.get('l');

const readFile = () => {
	$.get(`lang/${lang}.html`, (data) => {
		const doc = new DOMParser().parseFromString(data, 'text/html');
		doc.body.childNodes.forEach((node) => {
			if (node.nodeType !== 1) return;
			document
				.querySelectorAll(`[data-load="${node.localName}"]`)
				.forEach((el) => (el.innerHTML = node.innerHTML));
		});
	}).fail((jqXHR, textStatus, errorThrown) => {
		if (textStatus === 'error') {
			el_lang.value = lang_default;
			el_lang.dispatchEvent(new Event('change'));
		}
	});
};

el_lang.value = lang; // Set value on page load (is someone landed on i.e: #hr hash)
el_lang.addEventListener('change', (ev) => {
	lang = ev.target.value; // Set new language on select change
	history.pushState(null, null, `?l=${lang}`); // Add to URL
	readFile(); // Load content!
});

readFile(); // Load language