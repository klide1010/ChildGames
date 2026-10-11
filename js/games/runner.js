'use strict';
/* Saetta Corre: tocca per saltare, raccogli anelli, salta sui granchi, evita le spine. */
App.register({
  id: 'corsa',
  title: 'Saetta Corre',
  desc: 'Tocca lo schermo per saltare! Raccogli gli anelli ed evita le spine.',
  color: '#1f6fe5',
  duration: null,
  art: () => Chars.img('saetta') + '<span class="ring-ico"></span>',
  stars: p => (p >= 800 ? 3 : p >= 350 ? 2 : p >= 100 ? 1 : 0),

  start(ctx) {
    const cv = ctx.canvas();
    const g = cv.g;
    const img = Chars.image('saetta');
    const { rand } = U;
    const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

    let W, H, ground, S;
    function dims() { W = cv.W; H = cv.H; ground = H * 0.8; S = Math.max(44, Math.min(H * 0.15, W * 0.17, 92)); }
    dims();

    const P = { x: W * 0.22, y: ground, vy: 0, jumps: 0, inv: 0, spin: 0 };
    let running = false, raf = 0, last = 0, t = 0, speed = W * 0.5;
    let obs = [], rings = [], lost = [];
    let held = 0, total = 0, lives = 3, stomps = 0, dist = 0, distAcc = 0, scroll = 0;
    let nextObs = W * 0.9, nextRing = W * 0.3;

    const grav = () => H * 3.2;

    function info() { ctx.info(`💍 ${held} · ${U.hearts(lives)}`); }

    function jump() {
      if (!running || P.jumps >= 2) return;
      P.vy = -Math.sqrt(2 * grav() * (P.jumps ? H * 0.26 : H * 0.4));
      P.jumps++;
      Sound.tone(P.jumps === 1 ? 520 : 760, 0.12, 'square', 0.06);
    }
    cv.c.addEventListener('pointerdown', jump);

    function spawnObstacle() {
      const kind = Math.random() < 0.55 ? 'spike' : 'crab';
      if (kind === 'spike') obs.push({ kind, x: W + S, w: S * 0.8, h: S * 0.45 });
      else obs.push({ kind, x: W + S, w: S * 0.62, h: S * 0.55, walk: rand(20, 60) });
    }

    function spawnRings() {
      const n = U.ri(3, 6), gap = S * 0.62;
      const arc = Math.random() < 0.5;
      const baseY = ground - S * rand(0.5, 1.9);
      for (let i = 0; i < n; i++) {
        const k = n > 1 ? i / (n - 1) : 0.5;
        const y = arc ? ground - S * 0.6 - Math.sin(k * Math.PI) * S * 1.6 : baseY;
        rings.push({ x: W + S + i * gap, y });
      }
    }

    function hit() {
      if (held > 0) {
        for (let i = 0; i < Math.min(held, 14); i++) {
          lost.push({ x: P.x, y: P.y - S / 2, vx: rand(-260, 260), vy: rand(-520, -220), life: 1.3 });
        }
        held = 0;
        P.inv = 1.5;
        Sound.tone(900, 0.4, 'sawtooth', 0.06);
        ctx.popup('Anelli persi!', P.x, P.y - S * 1.3, 'bad');
      } else {
        lives--;
        P.inv = 2;
        Sound.bad(); U.vibrate(200);
        ctx.popup('Ahia!', P.x, P.y - S * 1.3, 'bad');
        if (lives <= 0) { info(); gameOver(); return; }
      }
      info();
    }

    function gameOver() {
      running = false;
      setTimeout(() => ctx.end({
        title: 'Fine della corsa! 🏁',
        msg: `Anelli raccolti: <b>${total}</b> · Granchi saltati: <b>${stomps}</b><br>Distanza: <b>${Math.round(dist / S)} metri</b>`,
      }), 500);
    }

    function update(dt) {
      t += dt;
      speed = Math.min(W * 1.25, W * 0.5 + t * W * 0.012);
      const dx = speed * dt;
      dist += dx; scroll += dx;
      distAcc += dx / S;
      if (distAcc >= 1) { const n = Math.floor(distAcc); ctx.add(n); distAcc -= n; }

      P.vy += grav() * dt;
      P.y += P.vy * dt;
      if (P.y >= ground) { P.y = ground; P.vy = 0; P.jumps = 0; }
      P.spin += dt * 16;
      P.inv = Math.max(0, P.inv - dt);

      nextObs -= dx;
      if (nextObs <= 0) { spawnObstacle(); nextObs = speed * rand(1.15, 2.0); }
      nextRing -= dx;
      if (nextRing <= 0) { spawnRings(); nextRing = speed * rand(1.3, 2.6); }

      for (const o of obs) o.x -= dx + (o.walk || 0) * dt;
      obs = obs.filter(o => o.x + o.w > -20 && !o.dead);
      for (const r of rings) r.x -= dx;

      // anelli raccolti
      const cx = P.x, cy = P.y - S / 2;
      rings = rings.filter(r => {
        if (Math.hypot(r.x - cx, r.y - cy) < S * 0.6) {
          held++; total++;
          ctx.add(10);
          Sound.ring();
          info();
          return false;
        }
        return r.x > -30;
      });

      for (const l of lost) {
        l.vy += grav() * dt * 0.6; l.x += l.vx * dt - dx; l.y += l.vy * dt; l.life -= dt;
        if (l.y > ground) { l.y = ground; l.vy *= -0.6; }
      }
      lost = lost.filter(l => l.life > 0);

      // ostacoli
      const pl = P.x - S * 0.32, pr = P.x + S * 0.32, pt = P.y - S * 0.85, pb = P.y;
      for (const o of obs) {
        const ol = o.x + o.w * 0.15, or = o.x + o.w * 0.85, ot = ground - o.h * 0.85;
        if (pr > ol && pl < or && pb > ot && pt < ground) {
          if (o.kind === 'crab' && P.vy > 0 && pb - ot < S * 0.4) {
            o.dead = true;
            stomps++;
            ctx.add(20);
            ctx.popup('+20', o.x + o.w / 2, ot - 10, 'gold');
            Sound.good();
            P.vy = -Math.sqrt(2 * grav() * H * 0.18);
            P.jumps = 1;
          } else if (P.inv <= 0) {
            hit();
            if (!running) return;
          }
        }
      }
    }

    function drawRing(x, y, r, phase) {
      const sx = Math.max(0.15, Math.abs(Math.cos(phase)));
      g.save();
      g.translate(x, y);
      g.scale(sx, 1);
      g.lineWidth = r * 0.4;
      g.strokeStyle = '#c99a00';
      g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
      g.lineWidth = r * 0.25;
      g.strokeStyle = '#ffd23f';
      g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
      g.restore();
    }

    function draw() {
      g.clearRect(0, 0, W, H);

      // nuvole
      g.fillStyle = 'rgba(255,255,255,.85)';
      for (let i = 0; i < 4; i++) {
        const cx = ((i * W * 0.38 - scroll * 0.08) % (W * 1.5) + W * 1.5) % (W * 1.5) - W * 0.2;
        const cy = H * (0.12 + (i % 2) * 0.1);
        g.beginPath();
        g.arc(cx, cy, S * 0.35, 0, Math.PI * 2);
        g.arc(cx + S * 0.35, cy - S * 0.12, S * 0.42, 0, Math.PI * 2);
        g.arc(cx + S * 0.75, cy, S * 0.33, 0, Math.PI * 2);
        g.fill();
      }

      // colline
      const hw = W * 0.6;
      for (let layer = 0; layer < 2; layer++) {
        const off = (scroll * (layer ? 0.35 : 0.15)) % hw;
        g.fillStyle = layer ? '#3fae4a' : '#7fd46b';
        for (let x = -off - hw; x < W + hw; x += hw) {
          g.beginPath();
          g.ellipse(x + hw / 2, ground, hw * 0.55, H * (layer ? 0.18 : 0.3), 0, Math.PI, 0);
          g.fill();
        }
      }

      // terreno a scacchi
      const grass = S * 0.2, tile = S * 0.5;
      g.fillStyle = '#c47a2c';
      g.fillRect(0, ground, W, H - ground);
      g.fillStyle = '#9a5a1c';
      const start = -(scroll % (tile * 2));
      for (let x = start; x < W; x += tile) {
        for (let y = ground + grass, row = 0; y < H; y += tile, row++) {
          const ix = Math.round((x - start) / tile);
          if ((ix + row) % 2 === 0) g.fillRect(x, y, tile + 0.5, tile + 0.5);
        }
      }
      g.fillStyle = '#4cc94c';
      g.fillRect(0, ground, W, grass);
      g.fillStyle = '#2f9e44';
      for (let x = -(scroll % 16); x < W; x += 16) {
        g.beginPath(); g.moveTo(x, ground + grass); g.lineTo(x + 8, ground + grass + 6); g.lineTo(x + 16, ground + grass); g.fill();
      }

      // anelli
      for (const r of rings) drawRing(r.x, r.y, S * 0.2, t * 4 + r.x * 0.01);
      for (const l of lost) { g.globalAlpha = Math.min(1, l.life * 2); drawRing(l.x, l.y, S * 0.17, t * 8); }
      g.globalAlpha = 1;

      // ostacoli
      for (const o of obs) {
        if (o.kind === 'spike') {
          const n = 3, w = o.w / n;
          g.fillStyle = '#b0b7c3';
          g.strokeStyle = '#59606d';
          g.lineWidth = 2;
          for (let i = 0; i < n; i++) {
            g.beginPath();
            g.moveTo(o.x + i * w, ground);
            g.lineTo(o.x + i * w + w / 2, ground - o.h);
            g.lineTo(o.x + (i + 1) * w, ground);
            g.closePath(); g.fill(); g.stroke();
          }
        } else {
          g.font = `${Math.round(o.h * 1.1)}px ${EMOJI_FONT}`;
          g.textAlign = 'center'; g.textBaseline = 'bottom';
          g.fillText('🦀', o.x + o.w / 2, ground + o.h * 0.1);
        }
      }

      // Saetta
      const blink = P.inv > 0 && Math.floor(P.inv * 12) % 2 === 0;
      if (!blink && img.complete) {
        if (P.y < ground - 1) {
          g.save();
          g.translate(P.x, P.y - S / 2);
          g.rotate(P.spin);
          g.fillStyle = 'rgba(31,111,229,.35)';
          g.beginPath(); g.arc(0, 0, S * 0.55, 0, Math.PI * 2); g.fill();
          g.drawImage(img, -S / 2, -S / 2, S, S);
          g.restore();
        } else {
          const step = Math.sin(t * 22);
          g.fillStyle = '#e63946';
          g.strokeStyle = '#fff';
          g.lineWidth = 2;
          for (const s of [-1, 1]) {
            g.beginPath();
            g.ellipse(P.x + s * step * S * 0.18, P.y - S * 0.08, S * 0.2, S * 0.1, 0, 0, Math.PI * 2);
            g.fill(); g.stroke();
          }
          g.drawImage(img, P.x - S / 2, P.y - S * 1.05 + Math.abs(step) * 3, S, S);
        }
      }
    }

    function loop(now) {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      if (cv.W !== W || cv.H !== H) { dims(); P.x = W * 0.22; if (P.y > ground) P.y = ground; }
      if (running) update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }

    last = performance.now();
    raf = requestAnimationFrame(loop);

    ctx.intro({
      title: 'Saetta Corre',
      art: Chars.img('saetta'),
      text: 'Tocca lo schermo per <b>saltare</b> (tocca ancora in aria per il doppio salto!). Ogni anello vale <b>+10</b> e ti protegge. Salta sopra i granchi 🦀 per <b>+20</b>. Attento alle spine: hai 3 vite!',
    }, () => {
      running = true;
      info();
      ctx.begin();
    });

    return { stop() { running = false; cancelAnimationFrame(raf); cv.dispose(); } };
  },
});
