/**
 * BUCC Dino Runner & Boss Shooter - Sprite & Background Canvas Renderer
 * High-detail procedural character graphics, parallax BRACU campus backdrop, and projectile FX.
 */

const SpriteRenderer = {
  // Parallax offsets
  bgOffsetStars: 0,
  bgOffsetSkyline: 0,
  bgOffsetPillars: 0,
  groundOffset: 0,

  updateBackground(dt, speed = 300) {
    this.bgOffsetStars = (this.bgOffsetStars + speed * 0.05 * dt) % 960;
    this.bgOffsetSkyline = (this.bgOffsetSkyline + speed * 0.2 * dt) % 960;
    this.bgOffsetPillars = (this.bgOffsetPillars + speed * 0.5 * dt) % 960;
    this.groundOffset = (this.groundOffset + speed * dt) % 60;
  },

  drawBackground(ctx, width, height, currentLevel = 1) {
    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (currentLevel === 4) {
      // Crimson boss arena sky
      skyGrad.addColorStop(0, "#1a030c");
      skyGrad.addColorStop(0.6, "#2e0818");
      skyGrad.addColorStop(1, "#0d0208");
    } else if (currentLevel === 3) {
      // Deep purple arena sky
      skyGrad.addColorStop(0, "#0c051a");
      skyGrad.addColorStop(0.6, "#1f0d3d");
      skyGrad.addColorStop(1, "#080410");
    } else {
      // Cyber navy BUCC sky
      skyGrad.addColorStop(0, "#050914");
      skyGrad.addColorStop(0.6, "#0a1329");
      skyGrad.addColorStop(1, "#0f1c3f");
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Twinkling Stars
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (let i = 0; i < 45; i++) {
      const sx = ((i * 137.5 - this.bgOffsetStars * 0.5) % width + width) % width;
      const sy = (i * 23.3) % (height * 0.55);
      const size = (i % 3 === 0) ? 2 : 1.2;
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.restore();

    // 3. Far BRACU Campus Silhouette (UB Building / Towers)
    ctx.save();
    ctx.fillStyle = currentLevel === 4 ? "#1f0d1b" : "#0c1733";
    const skyX = -this.bgOffsetSkyline;
    for (let loop = 0; loop < 2; loop++) {
      const baseX = skyX + loop * width;
      // Tower 1 (UB main building)
      ctx.fillRect(baseX + 60, height - 280, 110, 200);
      // Tower 2
      ctx.fillRect(baseX + 210, height - 330, 130, 250);
      // Tower 3 with antenna
      ctx.fillRect(baseX + 380, height - 240, 90, 160);
      ctx.fillRect(baseX + 420, height - 290, 4, 50); // antenna
      // Tower 4
      ctx.fillRect(baseX + 510, height - 360, 160, 280);
      // Tower 5
      ctx.fillRect(baseX + 710, height - 260, 120, 180);
      // Tower 6
      ctx.fillRect(baseX + 860, height - 310, 80, 230);

      // Lit Windows Matrix
      ctx.fillStyle = currentLevel === 4 ? "rgba(255, 100, 120, 0.35)" : "rgba(0, 240, 255, 0.25)";
      for (let w = 0; w < 40; w++) {
        const wx = baseX + 70 + (w % 8) * 120;
        const wy = height - 220 + Math.floor(w / 8) * 25;
        if (w % 2 === 0) {
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
      ctx.fillStyle = currentLevel === 4 ? "#1f0d1b" : "#0c1733";
    }
    ctx.restore();

    // 4. Midground Tech Billboards / BUCC Signage
    ctx.save();
    const pilX = -this.bgOffsetPillars;
    for (let loop = 0; loop < 2; loop++) {
      const bx = pilX + loop * width;
      // Tech lamp post 1
      ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + 180, height - 70);
      ctx.lineTo(bx + 180, height - 160);
      ctx.lineTo(bx + 205, height - 160);
      ctx.stroke();

      // Neon BUCC Billboard
      const signX = bx + 480;
      const signY = height - 180;
      ctx.fillStyle = "rgba(10, 20, 45, 0.85)";
      ctx.strokeStyle = currentLevel === 4 ? "#ff0055" : "#00f0ff";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(signX, signY, 150, 42);
      ctx.fillRect(signX, signY, 150, 42);

      ctx.font = "bold 12px 'Orbitron', sans-serif";
      ctx.fillStyle = currentLevel === 4 ? "#ff5e7e" : "#00f0ff";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.textAlign = "center";
      ctx.fillText(currentLevel === 4 ? "GB APEX ARENA" : "BUCC CAMPUS", signX + 75, signY + 22);

      ctx.font = "bold 8px 'Rajdhani', sans-serif";
      ctx.fillStyle = "#ffd166";
      ctx.shadowBlur = 0;
      ctx.fillText("BRAC UNIVERSITY COMPUTER CLUB", signX + 75, signY + 34);
    }
    ctx.restore();

    // 5. Cyber Ground Floor
    const groundY = GAME_CONFIG.groundY;
    const groundH = height - groundY;

    // Ground Surface fill
    const gGrad = ctx.createLinearGradient(0, groundY, 0, height);
    gGrad.addColorStop(0, "#081024");
    gGrad.addColorStop(1, "#03060f");
    ctx.fillStyle = gGrad;
    ctx.fillRect(0, groundY, width, groundH);

    // Glowing Top Border Line
    ctx.save();
    ctx.strokeStyle = currentLevel === 4 ? "#ff0055" : "#00f0ff";
    ctx.lineWidth = 3;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
    ctx.restore();

    // High-speed moving grid track lines
    ctx.save();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
    ctx.lineWidth = 1.5;
    const gridStep = 40;
    for (let gx = -this.groundOffset; gx < width; gx += gridStep) {
      ctx.beginPath();
      ctx.moveTo(gx, groundY);
      ctx.lineTo(gx - 20, height);
      ctx.stroke();
    }
    // Horizontal subline
    ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(0, groundY + 25);
    ctx.lineTo(width, groundY + 25);
    ctx.stroke();
    ctx.restore();
  },

  /* =========================================================================
     Player Character Rendering
     ========================================================================= */
  drawPlayer(ctx, player) {
    const { x, y, width, height, isGrounded, animTimer, rank, equippedWeapon, aimAngle, isInvulnerable, flipAngle, isShieldActive, shieldEnergy } = player;

    // 1. Shadow on ground (Always horizontal on ground, unrotated)
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    const shadowScale = isGrounded ? 1 : Math.max(0.4, 1 - Math.abs(y - GAME_CONFIG.groundY + height) / 160);
    ctx.beginPath();
    ctx.ellipse(x + width / 2, GAME_CONFIG.groundY, 18 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Player Body & Weapons (Pivots around center for somersault/flips)
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!isGrounded && flipAngle) {
      ctx.rotate(flipAngle);
    }
    ctx.translate(0, height / 2); // Local origin back to feet so all sprite coords remain exact

    // Invulnerability flashing effect
    if (isInvulnerable && Math.floor(animTimer * 15) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Running animation cycle
    const runCycle = Math.sin(animTimer * 14);
    const legOffset1 = isGrounded ? runCycle * 14 : -8;
    const legOffset2 = isGrounded ? -runCycle * 14 : 10;

    // Rank uniform colors
    let uniformColor = "#0077b6";
    let accentColor = "#00f0ff";
    let badgeText = "GM";

    if (rank === "EXECUTIVE") {
      uniformColor = "#c77700";
      accentColor = "#ff9f1c";
      badgeText = "EXEC";
    } else if (rank === "SENIOR_EXECUTIVE") {
      uniformColor = "#5a189a";
      accentColor = "#b5179e";
      badgeText = "SR";
    } else if (rank === "EXECUTIVE_BOARD" || rank === "GOVERNING_BODY") {
      uniformColor = "#14213d";
      accentColor = "#ffd166";
      badgeText = "EB";
    }

    // 1. Legs
    ctx.fillStyle = "#1b263b";
    // Back leg
    ctx.fillRect(-8 + legOffset2 * 0.4, -22, 6, 22);
    // Shoes
    ctx.fillStyle = accentColor;
    ctx.fillRect(-9 + legOffset2 * 0.4, -4, 9, 5);

    // Front leg
    ctx.fillStyle = "#24334c";
    ctx.fillRect(2 + legOffset1 * 0.4, -22, 6, 22);
    // Shoes
    ctx.fillStyle = accentColor;
    ctx.fillRect(1 + legOffset1 * 0.4, -4, 9, 5);

    // 2. Torso (BUCC Hoodie/Polo)
    ctx.fillStyle = uniformColor;
    ctx.beginPath();
    ctx.roundRect(-13, -50, 26, 30, 4);
    ctx.fill();

    // BUCC Lanyard / Tie / Stripe
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-2, -50);
    ctx.lineTo(0, -32);
    ctx.lineTo(2, -50);
    ctx.stroke();

    // Student ID badge
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-4, -34, 8, 10);
    ctx.fillStyle = accentColor;
    ctx.fillRect(-3, -32, 6, 3);

    // 3. Head & Face
    ctx.fillStyle = "#fcd5ce"; // skin tone
    ctx.beginPath();
    ctx.arc(0, -60, 11, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Cap
    ctx.fillStyle = "#1c1917";
    ctx.beginPath();
    ctx.arc(0, -63, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    // Cap brim
    ctx.fillRect(2, -64, 11, 3);

    // Cyber visor / glasses
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 6;
    ctx.fillRect(3, -61, 8, 4);
    ctx.shadowBlur = 0;

    // 4. Arms & Equipped Weapon
    ctx.save();
    ctx.translate(2, -42);
    // Rotate arm towards aiming reticle, shield stance, or running posture
    if (isShieldActive) {
      ctx.rotate(0.08); // Forward defensive shield brace
    } else if (player.canShoot && aimAngle !== undefined) {
      ctx.rotate(aimAngle);
    } else {
      ctx.rotate(-0.1 + (isGrounded ? -runCycle * 0.3 : -0.4));
    }

    // Arm
    ctx.fillStyle = uniformColor;
    ctx.fillRect(0, -3, 16, 6);
    // Hand
    ctx.fillStyle = "#fcd5ce";
    ctx.fillRect(15, -3, 5, 5);

    // Shield projector emitter on wrist if shield active
    if (isShieldActive) {
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 8;
      ctx.fillRect(18, -4, 4, 7);
      ctx.shadowBlur = 0;
    }

    // Render Equipped Weapon in hand (Level 3 or 4)
    if (player.canShoot && !isShieldActive) {
      this.drawWeaponInHand(ctx, equippedWeapon, 18, -4);
    }
    ctx.restore();

    // Rank Badge Indicator tag hovering slightly above head
    ctx.save();
    ctx.fillStyle = accentColor;
    ctx.font = "bold 9px 'Orbitron', sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 6;
    ctx.fillText(badgeText, 0, -75);
    ctx.restore();

    ctx.restore(); // Restore flip matrix

    // 3. Draw Holographic Energy Shield in front of player
    if (isShieldActive && shieldEnergy > 0) {
      this.drawShield(ctx, player);
    }
  },

  drawShield(ctx, player) {
    const { x, y, width, height, shieldEnergy, animTimer } = player;
    const shieldX = x + width + 8;
    const shieldY = y + height / 2;
    const energyRatio = Math.max(0.15, shieldEnergy / 100);

    ctx.save();
    // Shield glow aura
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 16 + Math.sin(animTimer * 12) * 5;

    // Outer curved barrier arc
    const arcHeight = height * 0.74;
    const arcWidth = 24;

    ctx.strokeStyle = `rgba(0, 240, 255, ${0.85 * energyRatio})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(shieldX, shieldY, arcWidth, arcHeight, 0, -Math.PI * 0.48, Math.PI * 0.48);
    ctx.stroke();

    // Inner bright energy core line
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * energyRatio})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(shieldX - 2, shieldY, arcWidth - 4, arcHeight - 6, 0, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    // Glowing energy field gradient fill
    const shieldGrad = ctx.createRadialGradient(shieldX - 10, shieldY, 5, shieldX, shieldY, 35);
    shieldGrad.addColorStop(0, `rgba(0, 240, 255, ${0.38 * energyRatio})`);
    shieldGrad.addColorStop(0.7, `rgba(0, 119, 182, ${0.18 * energyRatio})`);
    shieldGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.ellipse(shieldX, shieldY, arcWidth + 2, arcHeight, 0, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.fill();

    // High-tech holographic hexagonal grid ribs
    ctx.strokeStyle = `rgba(0, 240, 255, ${0.45 * energyRatio})`;
    ctx.lineWidth = 1.2;
    for (let i = -2; i <= 2; i++) {
      const segY = shieldY + i * 16;
      const pulseX = Math.sin(animTimer * 10 + i) * 2;
      ctx.beginPath();
      ctx.moveTo(shieldX - 12 + pulseX, segY - 6);
      ctx.lineTo(shieldX + 4 + pulseX, segY);
      ctx.lineTo(shieldX - 12 + pulseX, segY + 6);
      ctx.stroke();
    }

    // Mini shield status hologram
    ctx.shadowBlur = 0;
    ctx.font = "bold 8px 'Orbitron', monospace";
    ctx.fillStyle = "#00f0ff";
    ctx.textAlign = "center";
    ctx.fillText(`SHIELD ${Math.ceil(shieldEnergy)}%`, shieldX + 6, shieldY - arcHeight - 4);

    ctx.restore();
  },

  drawWeaponInHand(ctx, weaponId, wx, wy) {
    if (weaponId === "cannon") {
      // Heavy Cannon
      ctx.fillStyle = "#1f1a38";
      ctx.fillRect(wx, wy - 3, 18, 9);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(wx + 4, wy - 4, 3, 11);
      ctx.fillRect(wx + 10, wy - 4, 3, 11);
      ctx.fillRect(wx + 16, wy - 2, 4, 7);
    } else if (weaponId === "blaster") {
      // Rapid Blaster
      ctx.fillStyle = "#3c096c";
      ctx.fillRect(wx, wy - 2, 16, 6);
      ctx.fillStyle = "#ff007f";
      ctx.fillRect(wx + 14, wy - 3, 5, 3);
      ctx.fillRect(wx + 14, wy + 2, 5, 3);
    } else {
      // Standard Pistol
      ctx.fillStyle = "#334155";
      ctx.fillRect(wx, wy - 2, 12, 5);
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(wx + 10, wy - 2, 3, 2);
    }
  },

  /* =========================================================================
     Enemy Sprites (Level 1 GM, Level 2 Execs, Level 3 SE, Level 4 GB Bosses)
     ========================================================================= */

  drawRunnerGM(ctx, gm) {
    const { x, y, width, height, animTimer } = gm;
    ctx.save();
    ctx.translate(x + width / 2, y + height);

    const runCycle = Math.sin(animTimer * 13);

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = "#334155";
    ctx.fillRect(-6 + runCycle * 5, -20, 5, 20);
    ctx.fillRect(1 - runCycle * 5, -20, 5, 20);

    // Torso (GM Hoodie)
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(-11, -46, 22, 28, 4);
    ctx.fill();

    // BUCC Lanyard
    ctx.strokeStyle = "#00b4d8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-2, -46);
    ctx.lineTo(0, -30);
    ctx.lineTo(2, -46);
    ctx.stroke();

    // Carrying Laptop
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(-15, -34, 10, 12);
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(-14, -32, 8, 4);

    // Head
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(0, -54, 9, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(0, -56, 9, Math.PI, Math.PI * 2);
    ctx.fill();

    // "GM" Tag and Candidate Name
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 9px 'Orbitron', sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 6;
    ctx.fillText("GM MEMBER", 0, -78);

    ctx.font = "bold 8px 'Rajdhani', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fillText(gm.name || "Candidate", 0, -68);

    ctx.restore();
  },

  drawDepartmentExec(ctx, exec) {
    const { x, y, width, height, animTimer, dept, name, hasGun } = exec;
    ctx.save();
    ctx.translate(x + width / 2, y + height);

    const themeColor = dept.themeColor || "#ff9f1c";
    const runCycle = Math.sin(animTimer * 14);

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-7 + runCycle * 6, -22, 5, 22);
    ctx.fillRect(2 - runCycle * 6, -22, 5, 22);

    // Torso with Department Polo
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.roundRect(-12, -48, 24, 28, 4);
    ctx.fill();

    // Executive Armband
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-13, -42, 4, 6);

    // Head
    ctx.fillStyle = "#fcd5ce";
    ctx.beginPath();
    ctx.arc(0, -56, 10, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(0, -58, 10, Math.PI, Math.PI * 2);
    ctx.fill();

    // Holding gun if armed
    if (hasGun) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-18, -38, 10, 5);
      ctx.fillStyle = themeColor;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 6;
      ctx.fillRect(-22, -38, 5, 2);
      ctx.shadowBlur = 0;
    }

    // Floating Name, Rank & Department Badge
    ctx.save();
    ctx.font = "bold 9px 'Orbitron', sans-serif";
    ctx.fillStyle = themeColor;
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 6;
    ctx.textAlign = "center";
    const rankLabel = exec.rank === "Senior Executive" ? "SR. EXEC" : "EXEC";
    ctx.fillText(`${dept.name} • ${rankLabel}`, 0, -76);

    ctx.font = "bold 8px 'Rajdhani', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fillText(`${name} (${exec.title || ""})`, 0, -66);
    ctx.restore();

    ctx.restore();
  },

  drawArenaSeniorExec(ctx, se) {
    const { x, y, width, height, hp, maxHp, name, title, color } = se;
    ctx.save();
    ctx.translate(x + width / 2, y + height);

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tactical suit legs
    ctx.fillStyle = "#090d16";
    ctx.fillRect(-9, -26, 7, 26);
    ctx.fillRect(2, -26, 7, 26);

    // Torso with dark tailored blazer
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.roundRect(-15, -56, 30, 32, 4);
    ctx.fill();

    // Glowing lapel
    ctx.strokeStyle = color || "#b5179e";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-12, -54, 24, 26);

    // Head
    ctx.fillStyle = "#fcd5ce";
    ctx.beginPath();
    ctx.arc(0, -66, 11, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(0, -68, 11, Math.PI, Math.PI * 2);
    ctx.fill();

    // Gun aimed at player (to the left)
    ctx.fillStyle = "#334155";
    ctx.fillRect(-26, -46, 16, 7);
    ctx.fillStyle = color || "#00f0ff";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fillRect(-30, -45, 6, 3);
    ctx.shadowBlur = 0;

    // HP Bar & Name plate above head
    const hpPercent = Math.max(0, hp / maxHp);
    const barW = 60;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(-barW / 2, -88, barW, 6);
    ctx.fillStyle = color || "#00f0ff";
    ctx.fillRect(-barW / 2, -88, barW * hpPercent, 6);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.strokeRect(-barW / 2, -88, barW, 6);

    ctx.font = "bold 9px 'Orbitron', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(name, 0, -96);

    ctx.font = "bold 7.5px 'Rajdhani', sans-serif";
    ctx.fillStyle = color || "#ffd166";
    ctx.fillText(title, 0, -107);

    ctx.restore();
  },

  drawGoverningBodyBoss(ctx, boss) {
    const { x, y, width, height, hp, maxHp, name, title, color, pattern, attackCooldown } = boss;
    ctx.save();
    ctx.translate(x + width / 2, y + height);

    // Glowing Boss Aura
    const auraPulse = Math.sin(Date.now() * 0.006) * 6 + 18;
    const auraGrad = ctx.createRadialGradient(0, -40, 10, 0, -40, auraPulse + 25);
    auraGrad.addColorStop(0, "rgba(255, 209, 102, 0.25)");
    auraGrad.addColorStop(1, "transparent");
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, -40, auraPulse + 25, 0, Math.PI * 2);
    ctx.fill();

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = "#0b0f19";
    ctx.fillRect(-10, -28, 8, 28);
    ctx.fillRect(2, -28, 8, 28);

    // Torso (Executive Leadership Robe / Trenchcoat)
    ctx.fillStyle = "#1e1028";
    ctx.beginPath();
    ctx.roundRect(-18, -62, 36, 36, 6);
    ctx.fill();

    // Gold Trim & Epaulettes
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-16, -60, 32, 32);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(-20, -62, 6, 8); // left epaulette
    ctx.fillRect(14, -62, 6, 8);  // right epaulette

    // Head
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(0, -74, 12, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#374151";
    ctx.beginPath();
    ctx.arc(0, -77, 12, Math.PI, Math.PI * 2);
    ctx.fill();

    // Crown / Golden Leadership Emblem
    ctx.fillStyle = "#ffd166";
    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-10, -84);
    ctx.lineTo(-6, -92);
    ctx.lineTo(-1, -86);
    ctx.lineTo(4, -92);
    ctx.lineTo(8, -84);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Boss Weapon Aiming Forward
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-32, -52, 20, 9);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillRect(-38, -51, 8, 5);
    ctx.shadowBlur = 0;

    // HP Bar above boss
    const hpPercent = Math.max(0, hp / maxHp);
    const barW = 75;
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(-barW / 2, -100, barW, 8);
    ctx.fillStyle = color;
    ctx.fillRect(-barW / 2, -100, barW * hpPercent, 8);
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 1;
    ctx.strokeRect(-barW / 2, -100, barW, 8);

    // Title & Name
    ctx.font = "bold 9.5px 'Orbitron', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(name, 0, -110);

    ctx.font = "bold 7.5px 'Rajdhani', sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.fillText(title, 0, -121);

    ctx.restore();
  },

  /* =========================================================================
     Projectiles & Pickups
     ========================================================================= */

  drawBullet(ctx, bullet) {
    const { x, y, vx, vy, radius, color, isPlayer, pattern } = bullet;
    ctx.save();
    ctx.translate(x, y);

    const angle = Math.atan2(vy || 0, vx || (isPlayer ? 1 : -1));
    ctx.rotate(angle);

    ctx.shadowColor = color || "#00f0ff";
    ctx.shadowBlur = 10;
    ctx.fillStyle = color || "#00f0ff";

    if (pattern === "bouncing_orb") {
      ctx.beginPath();
      ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (pattern === "cluster_barrage") {
      // Golden coin projectile
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      // Elongated laser bolt oriented along flight trajectory
      const length = isPlayer ? radius * 3.5 : radius * 3.0;
      ctx.beginPath();
      ctx.ellipse(0, 0, length, radius, 0, 0, Math.PI * 2);
      ctx.fill();
      // White core
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(0, 0, length * 0.55, radius * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  drawCoin(ctx, coin) {
    const { x, y, radius, animTimer } = coin;
    ctx.save();
    ctx.translate(x, y);

    const spin = Math.cos(animTimer * 6);

    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#ffb703";
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(spin) * radius, radius, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffe494";
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(spin) * (radius * 0.7), radius * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    if (Math.abs(spin) > 0.4) {
      ctx.fillStyle = "#633800";
      ctx.font = "bold 9px 'Orbitron', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("C", 0, 0);
    }

    ctx.restore();
  }
};
