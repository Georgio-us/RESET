document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('[data-widget-demo]');
  if(!root)return;
  const steps=[...root.querySelectorAll('[data-widget-step]')];
  const image=root.querySelector('[data-widget-image]');
  const number=root.querySelector('[data-widget-number]');
  const title=root.querySelector('[data-widget-title]');
  const text=root.querySelector('[data-widget-text]');
  const progress=[...root.querySelectorAll('[data-widget-progress]')];
  const render=index=>{
    const step=steps[index];
    steps.forEach((item,i)=>item.setAttribute('aria-pressed',String(i===index)));
    progress.forEach((item,i)=>item.classList.toggle('active',i===index));
    image.src=step.dataset.src;
    image.alt=step.dataset.alt;
    number.textContent=String(index+1).padStart(2,'0');
    title.textContent=step.dataset.title;
    text.textContent=step.dataset.text;
  };
  steps.forEach((step,index)=>step.addEventListener('click',()=>render(index)));
  render(0);
});
