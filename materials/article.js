document.querySelector('[data-copy-link]')?.addEventListener('click', async event => { const button = event.currentTarget; try { await navigator.clipboard.writeText(window.location.href); button.textContent = 'Ссылка скопирована'; } catch { button.textContent = 'Скопируйте URL из адресной строки'; } });
const title = document.querySelector('h1')?.textContent.trim() || document.title;
const url = window.location.href;
document.querySelector('[data-share="telegram"]')?.setAttribute('href', `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
document.querySelector('[data-share="facebook"]')?.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
