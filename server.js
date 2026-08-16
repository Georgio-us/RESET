import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.env.PORT || 3000);
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const maxBodySize = 20_000;
const analyticsMeasurementId = 'G-TW7GHVZLVD';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const injectHeadScripts = (document) => document.replace('</head>', `<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
try {
  const storedConsent = localStorage.getItem('reset-analytics-consent');
  gtag('consent', 'default', {
    analytics_storage: storedConsent === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
} catch {
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
}
gtag('js', new Date());
gtag('config', '${analyticsMeasurementId}', { send_page_view: false, anonymize_ip: true });
</script><script async src="https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}"></script><script src="/arrow-icons.js" defer></script></head>`);

const sourceLabels = {
  hero: 'Первый экран — «Разобрать задачу»',
  methodology: 'Методика RESET — «Разобрать мою задачу»',
  'case-navigator': 'Навигатор ситуации — «Разобрать мою ситуацию»',
  services: 'Услуги — «Подобрать инструмент»',
  'open-form': 'Открытая форма — диагностика',
};

const countryLabels = {
  ua: 'Украина',
  es: 'Испания',
  other: 'Другая страна',
};

const localeLabels = {
  ru: 'RU',
  uk: 'UA',
  en: 'EN',
  es: 'ES',
};

const value = (input, maxLength = 800) => String(input || '')
  .replace(/[\u0000-\u001F\u007F]/g, ' ')
  .replace(/[<>]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength);

const formatDate = (date) => new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Madrid',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
}).format(date).replace(',', ',');

const deviceLabel = (client = {}) => {
  if (client.device) return value(client.device, 40);
  const userAgent = value(client.userAgent, 300).toLowerCase();
  return /mobile|android|iphone/.test(userAgent) ? 'Мобильное устройство' : 'Компьютер';
};

const browserLabel = (userAgent = '') => {
  const agent = String(userAgent).toLowerCase();
  if (agent.includes('edg/')) return 'Edge';
  if (agent.includes('firefox/')) return 'Firefox';
  if (agent.includes('chrome/')) return 'Chrome';
  if (agent.includes('safari/')) return 'Safari';
  return 'Не определён';
};

const getCountry = (request, lead) => {
  const cloudflareCountry = value(request.headers['cf-ipcountry'], 4).toUpperCase();
  const fromCloudflare = { UA: 'Украина', ES: 'Испания' }[cloudflareCountry];
  return fromCloudflare || countryLabels[lead.countryCode] || 'Не определена';
};

const createTelegramMessage = (lead, request) => {
  const method = lead.contactMethod === 'email' ? 'Email' : 'Телефон';
  const locale = localeLabels[lead.locale] || 'Не определён';
  const page = value(lead.page, 1_000) || 'Не указана';
  const client = lead.client && typeof lead.client === 'object' ? lead.client : {};
  const userAgent = value(request.headers['user-agent'], 600);
  const lines = [
    '🆕 Новая заявка',
    '',
    '📌 Источник',
    `Форма: ${sourceLabels[lead.source] || 'Форма сайта'}`,
    `🌐 Язык: ${locale}`,
    `🔗 Страница: ${page}`,
    `🕒 Время: ${formatDate(new Date())}`,
    '',
    '👤 Клиент',
  ];

  if (lead.name) lines.push(`Имя: ${lead.name}`);
  lines.push(`${method}: ${lead.contact}`);

  if (lead.message) {
    lines.push('', '💬 Комментарий:', lead.message);
  }

  const technicalLines = [
    `Страна: ${getCountry(request, lead)}`,
    `Устройство: ${deviceLabel(client)}`,
    `Браузер: ${browserLabel(userAgent)}`,
  ];
  if (client.screen) technicalLines.push(`Экран: ${value(client.screen, 30)}`);
  if (client.timezone) technicalLines.push(`Часовой пояс: ${value(client.timezone, 70)}`);
  if (client.referrer) technicalLines.push(`Переход: ${value(client.referrer, 500)}`);
  if (client.utm) {
    const utm = Object.entries(client.utm)
      .map(([key, item]) => `${key.replace('utm_', '')}: ${value(item, 100)}`)
      .filter((item) => !item.endsWith(': '));
    if (utm.length) technicalLines.push(`UTM: ${utm.join(' · ')}`);
  }

  lines.push('', '⚙️ Контекст', ...technicalLines);
  return lines.join('\n');
};

const readJson = (request) => new Promise((resolveBody, rejectBody) => {
  let body = '';
  request.setEncoding('utf8');
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > maxBodySize) rejectBody(new Error('Payload too large'));
  });
  request.on('end', () => {
    try {
      resolveBody(JSON.parse(body || '{}'));
    } catch {
      rejectBody(new Error('Invalid JSON'));
    }
  });
  request.on('error', rejectBody);
});

const replyJson = (response, status, data) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(data));
};

const handleLead = async (request, response) => {
  if (!telegramToken || !telegramChatId) {
    replyJson(response, 503, { ok: false, message: 'Приём заявок временно не настроен.' });
    return;
  }

  try {
    const rawLead = await readJson(request);
    const lead = {
      source: value(rawLead.source, 60),
      locale: value(rawLead.locale, 4).toLowerCase(),
      name: value(rawLead.name, 120),
      contact: value(rawLead.contact, 180),
      contactMethod: rawLead.contactMethod === 'email' ? 'email' : 'phone',
      countryCode: value(rawLead.countryCode, 10).toLowerCase(),
      message: value(rawLead.message, 2_000),
      page: value(rawLead.page, 1_000),
      client: rawLead.client && typeof rawLead.client === 'object' ? rawLead.client : {},
    };

    if (!lead.contact) {
      replyJson(response, 400, { ok: false, message: 'Укажите контакт для связи.' });
      return;
    }
    if (lead.contactMethod === 'email' && !/^\S+@\S+\.\S+$/.test(lead.contact)) {
      replyJson(response, 400, { ok: false, message: 'Проверьте email.' });
      return;
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: createTelegramMessage(lead, request),
        disable_web_page_preview: true,
      }),
    });

    if (!telegramResponse.ok) {
      console.error('Telegram notifier failed:', telegramResponse.status, await telegramResponse.text());
      replyJson(response, 502, { ok: false, message: 'Не удалось отправить заявку. Попробуйте ещё раз.' });
      return;
    }

    replyJson(response, 200, { ok: true });
  } catch (error) {
    console.error('Lead endpoint error:', error.message);
    replyJson(response, 400, { ok: false, message: 'Не удалось обработать заявку.' });
  }
};

const serveStatic = async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  // `/uk/` is the ISO language-code URL for Ukrainian. `/ua/` remains a
  // friendly alias for visitors who use the country abbreviation instead.
  if (pathname === '/ua' || pathname.startsWith('/ua/')) {
    response.writeHead(301, { Location: `${pathname.replace(/^\/ua(?=\/|$)/, '/uk')}${url.search}`, 'Cache-Control': 'no-store' });
    response.end();
    return;
  }

  if (pathname === '/') {
    response.writeHead(301, { Location: '/ru/', 'Cache-Control': 'no-store' });
    response.end();
    return;
  }

  const localeMatch = pathname.match(/^\/(ru|uk|en|es)(?:\/(.*))?$/);
  const locale = localeMatch?.[1];
  const localePath = localeMatch?.[2] || '';
  const requestedPath = (locale ? `/${localePath}` : pathname).endsWith('/')
    ? `${locale ? `/${localePath}` : pathname}index.html`
    : (locale ? `/${localePath}` : pathname);
  const localizedPath = locale ? `/${locale}${requestedPath}` : requestedPath;
  const filePath = resolve(root, `.${normalize(localizedPath)}`);
  if (!filePath.startsWith(root)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) throw new Error('Not a file');
    const extension = extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    if (extension === '.html') {
      const document = await readFile(filePath, 'utf8');
      response.end(injectHeadScripts(document));
      return;
    }
    response.end(await readFile(filePath));
  } catch {
    // Localized documents use the same public assets as the source site.
    // A request such as /uk/styles.css or /uk/assets/… therefore falls back
    // to the root asset without making untranslated HTML pages available.
    if (locale && !requestedPath.endsWith('.html')) {
      try {
        const sourceAssetPath = resolve(root, `.${normalize(requestedPath)}`);
        const assetStats = await stat(sourceAssetPath);
        if (assetStats.isFile()) {
          const extension = extname(sourceAssetPath).toLowerCase();
          response.writeHead(200, {
            'Content-Type': mimeTypes[extension] || 'application/octet-stream',
            'X-Content-Type-Options': 'nosniff',
          });
          response.end(await readFile(sourceAssetPath));
          return;
        }
      } catch {
        // Respond with the standard 404 below.
      }
    }
    const notFoundPath = locale ? resolve(root, `${locale}/404.html`) : resolve(root, '404.html');
    try {
      const document = await readFile(notFoundPath, 'utf8');
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
      response.end(injectHeadScripts(document));
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Страница не найдена');
    }
  }
};

createServer(async (request, response) => {
  const requestHost = String(request.headers.host || '').split(':')[0].toLowerCase();
  if (requestHost === 'www.resetdigital.agency') {
    response.writeHead(301, { Location: `https://resetdigital.agency${request.url || '/'}`, 'Cache-Control': 'no-store' });
    response.end();
    return;
  }

  if (request.method === 'POST' && request.url?.split('?')[0] === '/api/leads') {
    await handleLead(request, response);
    return;
  }

  if (request.method === 'GET' || request.method === 'HEAD') {
    await serveStatic(request, response);
    return;
  }

  response.writeHead(405, { Allow: 'GET, HEAD, POST' }).end('Method not allowed');
}).listen(port, '0.0.0.0', () => {
  console.log(`RESET is running on port ${port}`);
});
