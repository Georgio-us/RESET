document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('[data-widget-demo]');
  if(!root)return;
  const steps=[...root.querySelectorAll('[data-widget-step]')];
  const image=root.querySelector('[data-widget-image]');
  const number=root.querySelector('[data-widget-number]');
  const title=root.querySelector('[data-widget-title]');
  const text=root.querySelector('[data-widget-text]');
  const progress=[...root.querySelectorAll('[data-widget-progress]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let selected=0,timer=null,visible=false;
  const render=index=>{
    selected=index;
    const step=steps[index];
    steps.forEach((item,i)=>item.setAttribute('aria-pressed',String(i===index)));
    progress.forEach((item,i)=>item.classList.toggle('active',i===index));
    root.classList.remove('is-changing');
    void root.offsetWidth;
    root.classList.add('is-changing');
    image.src=step.dataset.src;
    image.alt=step.dataset.alt;
    number.textContent=String(index+1).padStart(2,'0');
    title.textContent=step.dataset.title;
    text.textContent=step.dataset.text;
  };
  const stop=()=>{clearInterval(timer);timer=null;};
  const start=()=>{stop();if(visible&&!reduce)timer=setInterval(()=>render((selected+1)%steps.length),2800);};
  steps.forEach((step,index)=>step.addEventListener('click',()=>{render(index);start();}));
  new IntersectionObserver(entries=>{
    const now=entries[0].isIntersecting;
    if(now&&!visible){visible=true;render(0);start();}
    if(!now&&visible){visible=false;stop();}
  },{threshold:.35}).observe(root);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  render(0);
});
