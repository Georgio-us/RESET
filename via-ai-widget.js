document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('[data-widget-demo]');
  if(!root)return;
  const steps=[...root.querySelectorAll('[data-widget-step]')];
  const image=root.querySelector('[data-widget-image]');
  const number=root.querySelector('[data-widget-number]');
  const title=root.querySelector('[data-widget-title]');
  const text=root.querySelector('[data-widget-text]');
  const progress=[...root.querySelectorAll('[data-widget-progress]')];
  const languageButtons=[...root.querySelectorAll('[data-widget-lang]')];
  let language=root.dataset.language||'ru';
  let current=0;
  const render=()=>{
    const step=steps[current];
    steps.forEach((item,index)=>item.setAttribute('aria-pressed',String(index===current)));
    progress.forEach((item,index)=>item.classList.toggle('active',index===current));
    languageButtons.forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.widgetLang===language)));
    image.src=step.dataset[language==='es'?'srcEs':'srcRu'];
    image.alt=step.dataset[language==='es'?'altEs':'altRu'];
    image.classList.toggle('is-launcher',current===0);
    number.textContent=String(current+1).padStart(2,'0');
    title.textContent=step.dataset[language==='es'?'titleEs':'titleRu'];
    text.textContent=step.dataset[language==='es'?'textEs':'textRu'];
  };
  steps.forEach((step,index)=>step.addEventListener('click',()=>{current=index;render()}));
  languageButtons.forEach(button=>button.addEventListener('click',()=>{language=button.dataset.widgetLang;render()}));
  render();
});
