export const contactMethods = { phone: 'Телефон', email: 'Email', telegram: 'Telegram', whatsapp: 'WhatsApp' };
const clean = (input, max = 800) => String(input || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
export function normalizeLead(raw) {
  return {
    source:clean(raw.source,60), locale:clean(raw.locale,4).toLowerCase(), name:clean(raw.name,120), company:clean(raw.company,180),
    contact:clean(raw.contact,180), contactMethod:Object.hasOwn(contactMethods, raw.contactMethod) ? raw.contactMethod : 'phone',
    countryCode:clean(raw.countryCode,10).toLowerCase(), message:clean(raw.message,2000), page:clean(raw.page,1000),
    client:raw.client && typeof raw.client === 'object' ? raw.client : {},
  };
}
export function contactLines(lead) {
  return [lead.name && `Имя: ${lead.name}`, lead.company && `Компания: ${lead.company}`, `${contactMethods[lead.contactMethod]}: ${lead.contact}`].filter(Boolean);
}
