/**
 * BUCC Dino Runner & Boss Shooter - Particle Engine & Combat FX
 * Handles running dust, muzzle flashes, sparks, floating damage text, and victory confetti.
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.confettiParticles = [];
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
    this.confettiParticles = [];
  }

  // Running foot dust
  spawnDust(x, y) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + (Math.random() * 8 - 4),
        y: y - 2,
        vx: -60 - Math.random() * 50,
        vy: -15 - Math.random() * 20,
        radius: 2 + Math.random() * 2.5,
        color: "rgba(0, 240, 255, 0.4)",
        alpha: 0.8,
        life: 0.35,
        maxLife: 0.35
      });
    }
  }

  // Spark / Hit burst
  spawnHitSparks(x, y, color = "#ff007f") {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 150;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.5,
        color: color,
        alpha: 1.0,
        life: 0.4,
        maxLife: 0.4
      });
    }
  }

  // Energy shield deflection sparks & ripple
  spawnShieldHit(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 1.4; // Spark outwards to the right
      const speed = 90 + Math.random() * 160;
      this.particles.push({
        x: x,
        y: y + (Math.random() * 20 - 10),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.5,
        color: Math.random() < 0.65 ? "#00f0ff" : "#ffffff",
        alpha: 1.0,
        life: 0.35,
        maxLife: 0.35
      });
    }
  }

  // Muzzle flash
  spawnMuzzleFlash(x, y, color = "#00f0ff") {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.random() - 0.5) * 0.8;
      const speed = 100 + Math.random() * 120;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
        color: color,
        alpha: 0.9,
        life: 0.15,
        maxLife: 0.15
      });
    }
  }

  // Coin sparkles
  spawnCoinSparkles(x, y) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 90;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
        color: "#ffd166",
        alpha: 1.0,
        life: 0.45,
        maxLife: 0.45
      });
    }
  }

  // Floating text (+1 COIN, -20 HP, CRIT!)
  addFloatingText(text, x, y, color = "#ffd166", size = 16) {
    this.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -55,
      color: color,
      size: size,
      alpha: 1.0,
      life: 0.8,
      maxLife: 0.8
    });
  }

  // Victory Confetti
  burstConfetti(width, height) {
    const colors = ["#00f0ff", "#ffd166", "#ff007f", "#00f5d4", "#9b5de5", "#ffffff"];
    for (let i = 0; i < 120; i++) {
      this.confettiParticles.push({
        x: Math.random() * width,
        y: -10 - Math.random() * 50,
        vx: (Math.random() - 0.5) * 160,
        vy: 120 + Math.random() * 180,
        size: 5 + Math.random() * 7,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 3.5,
        maxLife: 3.5
      });
    }
  }

  update(dt) {
    // Update basic particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ft.y += ft.vy * dt;
      ft.alpha = Math.max(0, ft.life / ft.maxLife);
    }

    // Update confetti
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const c = this.confettiParticles[i];
      c.life -= dt;
      if (c.life <= 0) {
        this.confettiParticles.splice(i, 1);
        continue;
      }
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rotation += c.vRot * dt;
    }
  }

  draw(ctx) {
    // Draw particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw floating texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.size}px 'Orbitron', 'Rajdhani', sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.textAlign = "center";
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // Draw confetti
    for (const c of this.confettiParticles) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 1.4);
      ctx.restore();
    }
  }
}
