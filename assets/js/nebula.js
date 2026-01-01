const SPEED = 2.5;

/* Animated nebula/particles background (canvas 2D) */
(function() {
  const canvas = document.getElementById('nzt-nebula');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = width * DPR; canvas.height = height * DPR; canvas.style.width = width + 'px'; canvas.style.height = height + 'px'; ctx.scale(DPR, DPR);

  const NUM = Math.min(360, Math.floor(width * height / 8000));
  const points = new Array(NUM).fill(0).map(() => spawn());

  function spawn() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: 0.6 + Math.random() * 1.8,
      hue: 185 + Math.random() * 80,
      life: 0,
    };
  }

  function step(p) {
    p.x += p.vx; p.y += p.vy; p.life += 1;
    if (p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
      Object.assign(p, spawn());
      p.x = Math.random() < 0.5 ? -10 : width + 10; // re-enter from sides
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    // soft background haze
    const grad = ctx.createRadialGradient(width*0.6, height*0.3, 0, width*0.5, height*0.5, Math.max(width, height));
    grad.addColorStop(0, 'rgba(10,20,60,0.35)');
    grad.addColorStop(1, 'rgba(7,10,18,0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,width,height);

    // particles
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      step(p);
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 0.8)`;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 0.5)`;
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // connective lines
    ctx.lineWidth = 0.8;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        if (d2 < 160*160) {
          const t = 1 - Math.sqrt(d2) / 160;
          const hue = (a.hue + b.hue) * 0.5;
          ctx.strokeStyle = `hsla(${hue}, 90%, 60%, ${t * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight;
    canvas.width = width * DPR; canvas.height = height * DPR; canvas.style.width = width + 'px'; canvas.style.height = height + 'px'; ctx.setTransform(DPR,0,0,DPR,0,0);
  }, { passive: true });

  draw();
})();



