'use strict';
(() => {
  const canvas=document.getElementById('cursorPetals');
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const petal=new Image();petal.src='assets/blush-petal.png';
  const STOP_DELAY=450,MOVE_COOLDOWN=2000,PARTICLES_PER_BURST=11,MAX_PARTICLES=33;
  let particles=[],frame=0,stopTimer=0,width=0,height=0;
  let anchor=null,target=null,armed=false,lastMoveBurst=-Infinity;
  const enabled=()=>!motion.matches&&!document.hidden;
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  function stop(){clearTimeout(stopTimer);stopTimer=0;cancelAnimationFrame(frame);frame=0;particles=[];anchor=null;target=null;armed=false;ctx.clearRect(0,0,width,height);}
  function emitPetals(point){
    if(!enabled())return;
    if(!petal.complete||!petal.naturalWidth)return;
    const now=performance.now();
    for(let i=0;i<PARTICLES_PER_BURST;i++){
      const angle=i/PARTICLES_PER_BURST*Math.PI*2+(Math.random()-.5)*.35;
      particles.push({x:point.x,y:point.y,born:now,life:2600+Math.random()*700,angle,radius:35+Math.random()*48,size:14+Math.random()*12,rotation:Math.random()*Math.PI*2,spin:(Math.random()-.5)*3,drift:(Math.random()-.5)*30});
    }
    particles=particles.slice(-MAX_PARTICLES);
    if(!frame)frame=requestAnimationFrame(draw);
  }
  function draw(now){
    frame=0;if(!enabled()){stop();return;}
    ctx.clearRect(0,0,width,height);
    particles=particles.filter(p=>now-p.born<p.life);
    for(const p of particles){
      const t=Math.max(0,(now-p.born)/p.life);
      const spread=1-Math.pow(1-Math.min(1,t/.8),2);
      const x=p.x+Math.cos(p.angle)*p.radius*spread+p.drift*t+Math.sin(t*6+p.angle)*5*t;
      const y=p.y+Math.sin(p.angle)*p.radius*.7*spread+57*t*t-15*Math.sin(Math.PI*t);
      const size=p.size*(.4+.6*Math.min(1,t/.18));
      const alpha=Math.min(1,t/.1)*Math.pow(1-t,1.25)*.88;
      ctx.save();ctx.translate(x,y);ctx.rotate(p.rotation+p.spin*t);ctx.globalAlpha=alpha;
      ctx.scale(.75+.25*Math.cos(t*5+p.angle),1);
      ctx.drawImage(petal,-size/2,-size/2,size,size);ctx.restore();
    }
    if(particles.length)frame=requestAnimationFrame(draw);
  }
  window.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'||!fine.matches||!enabled())return;
    target={x:e.clientX,y:e.clientY};
    if(!anchor)anchor={...target};
    if(Math.hypot(target.x-anchor.x,target.y-anchor.y)>6)armed=true;
    clearTimeout(stopTimer);
    if(armed)stopTimer=setTimeout(()=>{
      stopTimer=0;if(!armed||!target||!enabled())return;
      const now=performance.now();armed=false;anchor={...target};
      if(now-lastMoveBurst<MOVE_COOLDOWN)return;
      lastMoveBurst=now;emitPetals(target);
    },STOP_DELAY);
  },{passive:true});
  // One click event covers mouse clicks and browser-generated touch taps.
  window.addEventListener('click',e=>{
    if(e.detail===0||!enabled())return;
    clearTimeout(stopTimer);stopTimer=0;armed=false;
    target={x:e.clientX,y:e.clientY};anchor={...target};
    emitPetals(target);
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',stop);window.addEventListener('blur',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
  motion.addEventListener('change',stop);fine.addEventListener('change',stop);
  window.addEventListener('resize',()=>{stop();resize()},{passive:true});resize();
})();
