(function(){
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");

  let w = 0, h = 0, dpr = 1;
  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener("resize", resize, {passive:true});
  resize();

  // Partículas
  const particles = [];
  let running = false;

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function burst(x,y){
    const count = Math.floor(rand(45, 80));
    for(let i=0;i<count;i++){
      const angle = rand(0, Math.PI*2);
      const speed = rand(1.2, 4.2);
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: rand(55, 95),
        r: rand(1.2, 2.6),
        hue: rand(0, 360)
      });
    }
  }

  function step(){
    if(!running) return;
    ctx.clearRect(0,0,w,h);

    // Glow ligero
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(0,0,w,h);

    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravedad
      p.life -= 1;

      const alpha = Math.max(0, Math.min(1, p.life/90));
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, ${alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();

      if(p.life <= 0) particles.splice(i,1);
    }

    requestAnimationFrame(step);
  }

  // API pública
  window.Fireworks = {
    start(){
      if(running) return;
      running = true;
      // bursts aleatorios
      this._timer = setInterval(() => {
        burst(rand(w*0.2, w*0.8), rand(h*0.18, h*0.55));
      }, 520);
      step();
    },
    stop(){
      running = false;
      clearInterval(this._timer);
      ctx.clearRect(0,0,w,h);
      particles.length = 0;
    },
    burst(x,y){ burst(x,y); }
  };
})();
