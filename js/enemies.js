/**
 * BUCC Dino Runner & Boss Shooter - Enemy Classes
 * Handles Runner GMs (L1), Department Executives with guns (L2), Arena SEs (L3), and 4 GB Bosses (L4).
 */

// 1. Level 1: Runner GM
class RunnerGM {
  constructor(speed, gmInfo) {
    this.width = 30;
    this.height = 62;
    this.x = GAME_CONFIG.canvasWidth + 20;
    this.y = GAME_CONFIG.groundY - this.height;
    this.speed = speed || 310;
    this.name = gmInfo ? gmInfo.name : "Candidate GM";
    this.title = gmInfo ? gmInfo.title : "General Member";
    this.animTimer = Math.random() * 5;
    this.dodgedAwarded = false;
    this.isDead = false;
  }

  update(dt) {
    this.x -= this.speed * dt;
    this.animTimer += dt;
    if (this.x < -60) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    SpriteRenderer.drawRunnerGM(ctx, this);
  }
}

// 2. Level 2: Department Executive
class DepartmentExec {
  constructor(speed, dept, execInfo, hasGun = false) {
    this.width = 32;
    this.height = 64;
    this.x = GAME_CONFIG.canvasWidth + 20;
    this.y = GAME_CONFIG.groundY - this.height;
    this.speed = speed || 360;
    this.dept = dept;
    this.name = execInfo ? execInfo.name : "Executive";
    this.title = execInfo ? execInfo.title : "Officer";
    this.rank = execInfo ? (execInfo.rank || "Executive") : "Executive";
    this.hasGun = hasGun;
    this.animTimer = Math.random() * 5;
    this.dodgedAwarded = false;
    this.isDead = false;

    // Enhanced combat & firing parameters (High difficulty)
    this.shotsFired = 0;
    this.maxShots = 2; // Rapid 2-round burst
    this.burstCooldown = 0;
    this.burstInterval = 0.22; // 220ms between burst rounds
    this.shootTriggerDistance = 720 + Math.random() * 120; // Fires from long tactical range
  }

  update(dt, bullets, player, particles) {
    this.x -= this.speed * dt;
    this.animTimer += dt;
    if (this.burstCooldown > 0) {
      this.burstCooldown -= dt;
    }

    const playerX = player ? player.x : 120;
    // Gun firing trigger: fires rapid burst when within range and in front of player
    if (this.hasGun && this.shotsFired < this.maxShots && this.burstCooldown <= 0 && this.x <= this.shootTriggerDistance && this.x > playerX + 110) {
      this.fireBullet(bullets, player, particles);
      this.shotsFired++;
      this.burstCooldown = this.burstInterval;
    }

    if (this.x < -70) {
      this.isDead = true;
    }
  }

  fireBullet(bullets, player, particles) {
    Sounds.playEnemyShoot();
    const startX = this.x - 18;
    const startY = this.y + 24;

    // Target the main player directly (anticipates player elevation)
    const targetX = player ? (player.x + player.width / 2) : 120;
    const targetY = player ? (player.y + player.height / 2) : (this.y + 24);

    const dx = targetX - startX;
    const dy = targetY - startY;
    const angle = Math.atan2(dy, dx); // Points directly to the player on the left

    // High velocity projectile speed towards player
    const projectileSpeed = 680;

    bullets.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * projectileSpeed, // High-speed suppression fire towards player
      vy: Math.sin(angle) * projectileSpeed,
      damage: 22,
      radius: 5,
      color: this.dept.themeColor || "#ff9f1c",
      isPlayer: false,
      pattern: "straight"
    });

    if (particles) {
      particles.spawnMuzzleFlash(startX, startY, this.dept.themeColor || "#ff9f1c");
    }
  }

  draw(ctx) {
    SpriteRenderer.drawDepartmentExec(ctx, this);
  }
}

// 3. Level 3: Arena Senior Executive
class ArenaSeniorExec {
  constructor(config, posX, posY) {
    this.width = 38;
    this.height = 70;
    this.x = posX || 740;
    this.y = posY || (GAME_CONFIG.groundY - this.height);
    this.name = config.name;
    this.title = config.title;
    this.hp = config.hp || 120;
    this.maxHp = config.hp || 120;
    this.color = config.color || "#9b5de5";
    this.fireRate = config.fireRate || 1.8;
    this.bulletSpeed = 480; // Fast projectile speed towards player
    this.shootTimer = 0.8 + Math.random() * 1.0;
    this.isDead = false;
    this.hitFlashTimer = 0;
  }

  update(dt, bullets, player, particles) {
    this.shootTimer -= dt;
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= dt;
    }

    if (this.shootTimer <= 0 && this.hp > 0) {
      this.shootTimer = this.fireRate + Math.random() * 0.4;
      this.fireBullet(bullets, player, particles);
    }
  }

  fireBullet(bullets, player, particles) {
    Sounds.playEnemyShoot();
    const startX = this.x - 18;
    const startY = this.y + 24;

    // Direct line of sight towards main player
    const targetX = player ? (player.x + player.width / 2) : 140;
    const targetY = player ? (player.y + player.height / 2) : (this.y + 24);

    const dx = targetX - startX;
    const dy = targetY - startY;
    const angle = Math.atan2(dy, dx); // Points towards player on the left

    bullets.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * this.bulletSpeed,
      vy: Math.sin(angle) * this.bulletSpeed,
      damage: 18,
      radius: 5,
      color: this.color,
      isPlayer: false,
      pattern: "straight"
    });

    if (particles) {
      particles.spawnMuzzleFlash(startX, startY, this.color);
    }
  }

  takeDamage(amount, particles) {
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 0.1;
    Sounds.playHit();

    if (particles) {
      particles.spawnHitSparks(this.x + this.width / 2, this.y + this.height / 2, this.color);
      particles.addFloatingText(`-${amount}`, this.x + this.width / 2, this.y - 12, "#ffd166", 16);
    }

    if (this.hp <= 0) {
      this.isDead = true;
      if (particles) {
        particles.spawnHitSparks(this.x + this.width / 2, this.y + this.height / 2, "#ffd166");
        particles.addFloatingText("DEFEATED!", this.x + this.width / 2, this.y - 25, "#00f5d4", 20);
      }
    }
  }

  draw(ctx) {
    SpriteRenderer.drawArenaSeniorExec(ctx, this);
  }
}

// 4. Level 4: Governing Body Boss (4 simultaneous leaders!)
class GoverningBodyBoss {
  constructor(config, posX, posY) {
    this.id = config.id;
    this.width = 44;
    this.height = 76;
    this.x = posX;
    this.y = posY || (GAME_CONFIG.groundY - this.height);
    this.name = config.name;
    this.title = config.title;
    this.hp = config.hp || 200;
    this.maxHp = config.hp || 200;
    this.color = config.color || "#ff0055";
    this.pattern = config.pattern || "spread";
    this.fireRate = config.fireRate || 2.0;
    this.bulletSpeed = 480; // High projectile speed towards player
    this.shootTimer = 1.0 + Math.random() * 1.2;
    this.isDead = false;
    this.hitFlashTimer = 0;
  }

  update(dt, bullets, player, particles) {
    this.shootTimer -= dt;
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= dt;
    }

    if (this.shootTimer <= 0 && this.hp > 0) {
      this.shootTimer = this.fireRate + Math.random() * 0.5;
      this.executeAttackPattern(bullets, player, particles);
    }
  }

  executeAttackPattern(bullets, player, particles) {
    Sounds.playEnemyShoot();
    const startX = this.x - 22;
    const startY = this.y + 26;

    // Base angle directly pointing to player
    const targetX = player ? (player.x + player.width / 2) : 130;
    const targetY = player ? (player.y + player.height / 2) : (this.y + 26);
    const dx = targetX - startX;
    const dy = targetY - startY;
    const baseAngle = Math.atan2(dy, dx); // Points towards player on the left

    if (this.pattern === "spread") {
      // GB President: 3-Way Spread Shot centered on player
      const offsets = [-0.22, 0, 0.22];
      for (const off of offsets) {
        const angle = baseAngle + off;
        bullets.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * this.bulletSpeed,
          vy: Math.sin(angle) * this.bulletSpeed,
          damage: 18,
          radius: 6,
          color: this.color,
          isPlayer: false,
          pattern: "straight"
        });
      }
    } else if (this.pattern === "dual_burst") {
      // GB Vice President: Rapid dual beam focused at player
      const perpAngle = baseAngle + Math.PI / 2;
      for (let i = -1; i <= 1; i += 2) {
        const offX = Math.cos(perpAngle) * (i * 7);
        const offY = Math.sin(perpAngle) * (i * 7);
        bullets.push({
          x: startX + offX,
          y: startY + offY,
          vx: Math.cos(baseAngle) * (this.bulletSpeed * 1.15),
          vy: Math.sin(baseAngle) * (this.bulletSpeed * 1.15),
          damage: 16,
          radius: 5,
          color: this.color,
          isPlayer: false,
          pattern: "straight"
        });
      }
    } else if (this.pattern === "bouncing_orb") {
      // GB General Secretary: Bouncing heavy energy orb moving towards player
      bullets.push({
        x: startX,
        y: startY,
        vx: Math.cos(baseAngle) * this.bulletSpeed * 0.9,
        vy: 140, // initial downward vector that bounces on ground
        damage: 22,
        radius: 8,
        color: this.color,
        isPlayer: false,
        pattern: "bouncing_orb"
      });
    } else if (this.pattern === "cluster_barrage") {
      // GB Treasurer: Golden coin cluster fired towards player
      for (let i = 0; i < 2; i++) {
        const off = (i === 0 ? -0.15 : 0.15);
        const angle = baseAngle + off;
        bullets.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * (this.bulletSpeed * 0.95),
          vy: Math.sin(angle) * (this.bulletSpeed * 0.95),
          damage: 18,
          radius: 7,
          color: "#ffd166",
          isPlayer: false,
          pattern: "cluster_barrage"
        });
      }
    }

    if (particles) {
      particles.spawnMuzzleFlash(startX, startY, this.color);
    }
  }

  takeDamage(amount, particles) {
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 0.1;
    Sounds.playHit();

    if (particles) {
      particles.spawnHitSparks(this.x + this.width / 2, this.y + this.height / 2, this.color);
      particles.addFloatingText(`-${amount}`, this.x + this.width / 2, this.y - 12, "#ffd166", 18);
    }

    if (this.hp <= 0) {
      this.isDead = true;
      if (particles) {
        particles.spawnHitSparks(this.x + this.width / 2, this.y + this.height / 2, "#ffd166");
        particles.addFloatingText("BOSS DEFEATED!", this.x + this.width / 2, this.y - 30, "#00f5d4", 22);
      }
    }
  }

  draw(ctx) {
    SpriteRenderer.drawGoverningBodyBoss(ctx, this);
  }
}
