// ===== Helper: Typewriter =====
function typewriter(el, texts, speed=65, pause=1200){
  let i=0, j=0, del=false;
  const tick=()=>{
    if(!el) return;
    el.textContent = texts[i].slice(0, j);
    if(!del && j < texts[i].length){ j++; }
    else if(del && j>0){ j--; }
    else{
      if(!del){ del=true; setTimeout(tick, pause); return; }
      del=false; i=(i+1)%texts.length;
    }
    setTimeout(tick, del?30:speed);
  };
  tick();
}

// ===== Background Particles (minimal) =====
function initParticles(canvas){
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h;
  const dots = Array.from({length: 70}, ()=>({x:Math.random(), y:Math.random(), vx:(Math.random()-0.5)*0.0015, vy:(Math.random()-0.5)*0.0015}));
  function resize(){
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    dots.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>1) p.vx*=-1;
      if(p.y<0||p.y>1) p.vy*=-1;
    });
    // draw
    ctx.globalAlpha = 0.9;
    for(let i=0;i<dots.length;i++){
      const a = dots[i];
      for(let j=i+1;j<dots.length;j++){
        const b = dots[j];
        const dx=(a.x-b.x)*w, dy=(a.y-b.y)*h;
        const dist = Math.hypot(dx,dy);
        if(dist<140){
          ctx.strokeStyle = `rgba(124,58,237,${1 - dist/140})`;
          ctx.beginPath(); ctx.moveTo(a.x*w, a.y*h); ctx.lineTo(b.x*w, b.y*h); ctx.stroke();
        }
      }
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath(); ctx.arc(a.x*w, a.y*h, 2.2, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(step);
  }
  resize(); step();
  window.addEventListener('resize', resize);
}

// ===== Scroll reveal (IntersectionObserver) =====
function revealOnScroll(){
  const els = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.animate([{opacity:0, transform:'translateY(18px)'},{opacity:1, transform:'translateY(0)'}], {duration:600, easing:'cubic-bezier(.2,.65,.3,1)', fill:'forwards'});
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.1});
  els.forEach(el=>io.observe(el));
}

// ===== Tilt effect for cards =====
function tiltCards(){
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (y - 0.5)*8, ry = (0.5 - x)*10;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = 'translateY(-4px)';
    });
  });
}

// ===== Animate skill circles =====
function animateCircles(){
  document.querySelectorAll('.circle').forEach(c=>{
    const v = +c.dataset.value || 70;
    let cur = 0;
    const step = ()=>{
      cur += 1;
      c.style.setProperty('--val', cur);
      c.querySelector('.num').textContent = cur + '%';
      if(cur < v) requestAnimationFrame(step);
    };
    step();
  });
}

// ===== Modal for projects =====
function initModals(){
  document.querySelectorAll('[data-modal-open]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-modal-open');
      document.getElementById(id)?.classList.add('open');
    });
  });
  document.querySelectorAll('.modal .close').forEach(btn=>{
    btn.addEventListener('click', ()=> btn.closest('.modal').classList.remove('open'));
  });
}

// ===== Init on DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', ()=>{
  revealOnScroll();
  tiltCards();
  animateCircles();
  initModals();
  const heroTyper = document.querySelector('[data-typer]');
  if(heroTyper) typewriter(heroTyper, JSON.parse(heroTyper.dataset.typer));
  const canvas = document.querySelector('.hero-canvas');
  if(canvas) initParticles(canvas);
});
