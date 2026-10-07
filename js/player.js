/**
 * BUCC Dino Runner & Boss Shooter - Player Class
 * Manages player physics, jumping, HP, weapon cooldowns, aiming, and inventory.
 */

class Player {
  constructor() {
    this.width = 36;
    this.height = 68;
    this.x = 120;
    this.y = GAME_CONFIG.groundY - this.height;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;

    // Stats
    this.hp = 100;
    this.maxHp = 100;
    this.coins = 0;
    this.rank = "GM"; // GM, EXECUTIVE, SENIOR_EXECUTIVE, EXECUTIVE_BOARD, GOVERNING_BODY
    this.name = "General Member";

    // Combat
    this.canShoot = false; // Enabled in Level 3 and Level 4
    this.equippedWeapon = "pistol";
    this.inventory = ["pistol"];
    this.shootCooldown = 0;
    this.aimAngle = 0; // Radians towards reticle/mouse

    // Invulnerability frames on taking damage
    this.isInvulnerable = false;
    this.invulnTimer = 0;
    this.invulnDuration = 1.2;

    // Jumping Acrobatics (Flip & Backflip animations)
    this.isFlipping = false;
    this.flipAngle = 0; // Current rotation in radians
    this.flipDirection = 1; // 1 = frontflip, -1 = backflip
    this.flipSpeed = 7.4; // Radians per sec for full 360 somersault

    // Holographic Energy Shield (Right Click to hold & block enemy bullets)
    this.isShieldActive = false;
    this.shieldEnergy = 100;
    this.shieldMaxEnergy = 100;
    this.shieldDrainRate = 28; // Drains ~28% per second while held
    this.shieldRechargeRate = 32; // Recharges ~32% per second when released
    this.isShieldBroken = false;
    this.shieldBrokenTimer = 0;

    // Animations
    this.animTimer = 0;
  }

  reset(keepCoinsAndWeapons = false) {
    this.width = 36;
    this.height = 68;
    this.x = 120;
    this.y = GAME_CONFIG.groundY - this.height;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.hp = 100;
    this.maxHp = 100;
    this.shootCooldown = 0;
    this.isInvulnerable = false;
    this.invulnTimer = 0;
    this.animTimer = 0;

    // Reset acrobatics & shield
    this.isFlipping = false;
    this.flipAngle = 0;
    this.flipDirection = 1;
    this.isShieldActive = false;
    this.shieldEnergy = 100;
    this.isShieldBroken = false;
    this.shieldBrokenTimer = 0;

    if (!keepCoinsAndWeapons) {
      this.coins = 0;
      this.rank = "GM";
      this.equippedWeapon = "pistol";
      this.inventory = ["pistol"];
      this.canShoot = false;
    }
  }

  jump() {
    if (this.isGrounded) {
      this.vy = GAME_CONFIG.jumpForce;
      this.isGrounded = false;
      this.isFlipping = true;
      this.flipAngle = 0;
      // Alternate / randomize between Front Flip (1) and Back Flip (-1)
      this.flipDirection = Math.random() < 0.5 ? 1 : -1;
      Sounds.playJump();
      return true;
    }
    return false;
  }

  setShieldActive(active) {
    if (active) {
      // Cannot activate if broken/overheated or empty
      if (this.isShieldBroken || this.shieldEnergy <= 5) {
        return false;
      }
      if (!this.isShieldActive) {
        this.isShieldActive = true;
        if (typeof Sounds !== "undefined" && Sounds.playShieldUp) {
          Sounds.playShieldUp();
        }
      }
    } else {
      this.isShieldActive = false;
    }
    return this.isShieldActive;
  }

  absorbBulletDamage(damage, particles) {
    if (!this.isShieldActive || this.shieldEnergy <= 0) return false;

    // Shield absorbs the damage! Costs shield energy
    const energyCost = Math.max(12, damage * 0.7);
    this.shieldEnergy = Math.max(0, this.shieldEnergy - energyCost);

    if (particles) {
      particles.spawnShieldHit(this.x + this.width + 12, this.y + this.height / 2);
      particles.addFloatingText("BLOCKED!", this.x + this.width + 15, this.y - 12, "#00f0ff", 18);
    }

    if (typeof Sounds !== "undefined" && Sounds.playShieldDeflect) {
      Sounds.playShieldDeflect();
    }

    // Check if shield broke from absorbing
    if (this.shieldEnergy <= 0) {
      this.isShieldBroken = true;
      this.isShieldActive = false;
      this.shieldBrokenTimer = 2.2;
      if (typeof Sounds !== "undefined" && Sounds.playShieldBreak) {
        Sounds.playShieldBreak();
      }
      if (particles) {
        particles.addFloatingText("SHIELD OVERLOAD!", this.x + this.width / 2, this.y - 30, "#ff0055", 19);
        particles.spawnHitSparks(this.x + this.width + 10, this.y + this.height / 2, "#00f0ff");
      }
    }

    return true; // Successfully blocked
  }

  update(dt, particles) {
    this.animTimer += dt;

    // Apply gravity & jump flipping acrobatics
    if (!this.isGrounded) {
      this.vy += GAME_CONFIG.gravity * dt;
      this.y += this.vy * dt;

      // Rotate acrobatics in air
      this.flipAngle += this.flipDirection * this.flipSpeed * dt;

      // Ground collision
      if (this.y >= GAME_CONFIG.groundY - this.height) {
        this.y = GAME_CONFIG.groundY - this.height;
        this.vy = 0;
        this.isGrounded = true;
        this.isFlipping = false;
        this.flipAngle = 0; // Clean upright landing
        if (particles) {
          particles.spawnDust(this.x + this.width / 2, GAME_CONFIG.groundY);
        }
      }
    } else {
      this.flipAngle = 0;
      this.isFlipping = false;
      // Spawn running dust occasionally
      if (particles && Math.random() < 0.25) {
        particles.spawnDust(this.x + this.width / 2, GAME_CONFIG.groundY);
      }
    }

    // Shield energy management & recharge
    if (this.isShieldBroken) {
      this.shieldBrokenTimer -= dt;
      if (this.shieldBrokenTimer <= 0) {
        this.isShieldBroken = false;
      }
    }

    if (this.isShieldActive && !this.isShieldBroken && this.shieldEnergy > 0) {
      // Drain energy while holding shield
      this.shieldEnergy = Math.max(0, this.shieldEnergy - this.shieldDrainRate * dt);
      if (this.shieldEnergy <= 0) {
        this.isShieldBroken = true;
        this.isShieldActive = false;
        this.shieldBrokenTimer = 2.2;
        if (typeof Sounds !== "undefined" && Sounds.playShieldBreak) {
          Sounds.playShieldBreak();
        }
        if (particles) {
          particles.addFloatingText("SHIELD DEPLETED!", this.x + this.width / 2, this.y - 25, "#ff0055", 18);
        }
      }
    } else if (!this.isShieldActive && !this.isShieldBroken) {
      // Smooth passive recharge
      if (this.shieldEnergy < this.shieldMaxEnergy) {
        this.shieldEnergy = Math.min(this.shieldMaxEnergy, this.shieldEnergy + this.shieldRechargeRate * dt);
      }
    }

    // Cooldown timer update
    if (this.shootCooldown > 0) {
      this.shootCooldown = Math.max(0, this.shootCooldown - dt);
    }

    // Invulnerability timer update
    if (this.isInvulnerable) {
      this.invulnTimer -= dt;
      if (this.invulnTimer <= 0) {
        this.isInvulnerable = false;
      }
    }
  }

  // Shooting mechanic
  shoot(bullets, particles, targetX, targetY) {
    if (!this.canShoot) return false;
    if (this.shootCooldown > 0) return false;

    const weaponData = GAME_CONFIG.weapons[this.equippedWeapon] || GAME_CONFIG.weapons.pistol;
    this.shootCooldown = weaponData.cooldown; // 0.5s or 0.35s

    // Calculate aim angle
    let angle = 0;
    const startX = this.x + this.width + 10;
    const startY = this.y + 26;

    if (targetX !== undefined && targetY !== undefined) {
      angle = Math.atan2(targetY - startY, targetX - startX);
      this.aimAngle = angle;
    }

    const vx = Math.cos(angle) * weaponData.speed;
    const vy = Math.sin(angle) * weaponData.speed;

    bullets.push({
      x: startX,
      y: startY,
      vx: vx,
      vy: vy,
      damage: weaponData.damage,
      radius: weaponData.size,
      color: weaponData.color,
      isPlayer: true,
      weaponId: weaponData.id
    });

    Sounds.playShoot(weaponData.id);

    if (particles) {
      particles.spawnMuzzleFlash(startX, startY, weaponData.color);
    }

    return true;
  }

  takeDamage(amount, particles) {
    if (this.isInvulnerable || this.hp <= 0) return false;

    this.hp = Math.max(0, this.hp - amount);
    this.isInvulnerable = true;
    this.invulnTimer = this.invulnDuration;

    Sounds.playHit();

    if (particles) {
      particles.spawnHitSparks(this.x + this.width / 2, this.y + this.height / 2, "#ff0055");
      particles.addFloatingText(`-${amount} HP`, this.x + this.width / 2, this.y - 10, "#ff0055", 18);
    }

    // Screen damage flash effect
    const viewport = document.querySelector(".canvas-container");
    if (viewport) {
      viewport.classList.remove("screen-shake", "screen-damage-flash");
      void viewport.offsetWidth; // trigger reflow
      viewport.classList.add("screen-shake", "screen-damage-flash");
    }

    return true;
  }

  addCoins(amount, particles, x, y) {
    this.coins += amount;
    Sounds.playCoin();

    if (particles) {
      const spawnX = x !== undefined ? x : this.x + this.width / 2;
      const spawnY = y !== undefined ? y : this.y - 10;
      particles.spawnCoinSparkles(spawnX, spawnY);
      particles.addFloatingText(`+${amount} COINS`, spawnX, spawnY - 15, "#ffd166", 16);
    }
  }

  setRank(rankKey) {
    this.rank = rankKey;
  }

  equipWeapon(weaponId) {
    if (this.inventory.includes(weaponId) && GAME_CONFIG.weapons[weaponId]) {
      this.equippedWeapon = weaponId;
      return true;
    }
    return false;
  }

  buyWeapon(weaponId) {
    const weapon = GAME_CONFIG.weapons[weaponId];
    if (!weapon) return false;

    if (this.coins >= weapon.cost && !this.inventory.includes(weaponId)) {
      this.coins -= weapon.cost;
      this.inventory.push(weaponId);
      this.equipWeapon(weaponId);
      Sounds.playCoin();
      return true;
    }
    return false;
  }
}
