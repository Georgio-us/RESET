// Service-provider identity supplied by the site owner.
export const providerCopy = {
  uk: { title: 'Відомості про надавача послуг', text: 'Послуги під брендом Reset Digital надає фізична особа — підприємець Ліннік Олександра Сергіївна.', email: 'Електронна пошта', phone: 'Контактні телефони' },
  ru: { title: 'Сведения об исполнителе услуг', text: 'Услуги под брендом Reset Digital оказывает физическое лицо — предприниматель Линник Александра Сергеевна (Ліннік Олександра Сергіївна).', email: 'Электронная почта', phone: 'Контактные телефоны' },
  en: { title: 'Service provider information', text: 'Services under the Reset Digital brand are provided by sole proprietor Oleksandra Serhiivna Linnik (Ліннік Олександра Сергіївна).', email: 'Email', phone: 'Contact numbers' },
  es: { title: 'Información sobre la prestadora de servicios', text: 'Los servicios bajo la marca Reset Digital los presta la empresaria individual Oleksandra Serhiivna Linnik (Ліннік Олександра Сергіївна).', email: 'Correo electrónico', phone: 'Teléfonos de contacto' },
};
const taxAddressLabels = { ru: 'Налоговый адрес по документам', uk: 'Податкова адреса за документами', en: 'Tax address as stated in the documents', es: 'Domicilio fiscal según los documentos' };
export function providerDetails(locale = 'ru', footer = false) {
  const c = providerCopy[locale] || providerCopy.ru;
  const heading = footer ? `<p class="reset-provider-title">${c.title}</p>` : `<h2>${c.title}</h2>`;
  const legalDetails = footer ? '' : `<p>РНОКПП / Tax ID: <span translate="no">3672303085</span></p><p>${taxAddressLabels[locale] || taxAddressLabels.ru}: <span lang="uk" translate="no">Україна, 93205, Луганська обл., Алчевський р-н, місто Сокологірськ, вул. Леніна, будинок 50, квартира 19</span>.</p>`;
  return `<section class="${footer ? 'reset-footer-provider' : 'privacy-provider'}" aria-label="${c.title}">${heading}<p>${c.text}</p>${legalDetails}<p>${c.email}: <a href="mailto:shura17.al@gmail.com">shura17.al@gmail.com</a><br>${c.phone}: <a href="tel:+380507779120">+380507779120</a>, <a href="tel:+380938849214">+380938849214</a></p></section>`;
}
