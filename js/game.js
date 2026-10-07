/**
 * BUCC Dino Runner & Boss Shooter - Main Game Engine
 * Coordinates game loop, physics updates, combat collisions, input handling, and state transitions.
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Game state
    this.state = "START"; // START, PLAYING, PROMOTION, STORE, GAME_OVER, VICTORY
    this.lastTime = 0;
    this.score = 0;
    this.playerName = "General Member";

    // Entities & Systems
    this.player = new Player();
    this.particles = new ParticleSystem();
    this.enemies = [];
    this.bullets = [];
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;

    // Sub-systems
    this.levelManager = new LevelManager(this);
    this.ui = new UIManager(this);

    this.initCanvasSize();
    this.bindInputs();
    this.ui.showStartScreen();

    // Start render loop
    requestAnimationFrame((t) => this.loop(t));
  }

  initCanvasSize() {
    this.canvas.width = GAME_CONFIG.canvasWidth;
    this.canvas.height = GAME_CONFIG.canvasHeight;
  }

  bindInputs() {
    // Keyboard inputs
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;

      // Start music on first keypress
      Sounds.playBgm();

      if (this.state === "PLAYING") {
        // Jump: Space or ArrowUp or KeyW
        if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
          e.preventDefault();
          this.player.jump();
        }

        // Shoot: KeyF
        if (e.code === "KeyF" && this.player.canShoot) {
          e.preventDefault();
          this.player.shoot(this.bullets, this.particles, this.mouseX, this.mouseY);
          this.ui.updateHUD();
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    // Prevent default context menu on right click everywhere in game
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    // Mouse aiming & shooting (Left click = shoot, Right click = shield)
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;

      // Update player aim angle if in arena mode
      if (this.player.canShoot) {
        const startX = this.player.x + this.player.width + 10;
        const startY = this.player.y + 26;
        this.player.aimAngle = Math.atan2(this.mouseY - startY, this.mouseX - startX);
      }
    });

    this.canvas.addEventListener("mousedown", (e) => {
      if (this.state !== "PLAYING") return;

      if (e.button === 0) {
        // Left Click: Fire weapon in arena stages, or jump in runner stages
        if (this.player.canShoot) {
          this.player.shoot(this.bullets, this.particles, this.mouseX, this.mouseY);
          this.ui.updateHUD();
        } else {
          this.player.jump();
        }
      } else if (e.button === 2) {
        // Right Click: Deploy Energy Shield to block incoming bullets
        e.preventDefault();
        this.player.setShieldActive(true);
        this.ui.updateHUD();
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (e.button === 2) {
        // Right Click release: Lower shield
        this.player.setShieldActive(false);
        this.ui.updateHUD();
      }
    });

    window.addEventListener("blur", () => {
      this.player.setShieldActive(false);
    });

    // Touch support for mobile/tablets
    this.canvas.addEventListener("touchstart", (e) => {
      if (this.state === "PLAYING") {
        if (this.player.canShoot) {
          const touch = e.touches[0];
          const rect = this.canvas.getBoundingClientRect();
          this.mouseX = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
          this.mouseY = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
          this.player.shoot(this.bullets, this.particles, this.mouseX, this.mouseY);
          this.ui.updateHUD();
        } else {
          this.player.jump();
        }
      }
    }, { passive: true });
  }

  startGame() {
    this.score = 0;
    this.enemies = [];
    this.bullets = [];
    this.particles.reset();
    this.player.reset();
    this.player.name = this.playerName;

    this.levelManager.reset();
    this.levelManager.startLevel(1);

    this.state = "PLAYING";
    this.ui.hideAllModals();
    this.ui.hudOverlay.classList.remove("hidden");
    this.ui.updateHUD();
    Sounds.playBgm();
  }

  restartGame() {
    this.startGame();
  }

  triggerPromotion(currentLevel) {
    this.state = "PROMOTION";
    const lvlConfig = GAME_CONFIG.levels[currentLevel];
    this.ui.showPromotionModal(currentLevel, lvlConfig.promotionMessage, lvlConfig.nextRank);
  }

  proceedAfterPromotion() {
    const nextLvl = this.levelManager.currentLevel + 1;
    this.levelManager.startLevel(nextLvl);
    this.state = "PLAYING";
    this.ui.hudOverlay.classList.remove("hidden");
  }

  triggerStoreIntermission() {
    this.state = "STORE";
    this.ui.showStoreModal();
  }

  triggerVictory() {
    this.state = "VICTORY";
    this.score += 5000; // Big victory bonus
    this.player.setRank("GOVERNING_BODY");
    this.ui.showVictoryModal();
  }

  triggerGameOver() {
    this.state = "GAME_OVER";
    this.ui.showGameOverModal();
  }

  buyWeapon(weaponId) {
    if (this.player.buyWeapon(weaponId)) {
      this.ui.renderStoreWeapons();
      this.ui.updateHUD();
    }
  }

  equipWeapon(weaponId) {
    if (this.player.equipWeapon(weaponId)) {
      this.ui.renderStoreWeapons();
      this.ui.updateHUD();
    }
  }

  /* =========================================================================
     Game Loop
     ========================================================================= */

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // Cap max dt to 50ms
    this.lastTime = timestamp;

    if (this.state === "PLAYING") {
      this.update(dt);
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Tactical player movement in Arena mode (Level 3 & 4)
    if (this.player.canShoot) {
      if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
        this.player.x = Math.max(40, this.player.x - 220 * dt);
      }
      if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
        this.player.x = Math.min(320, this.player.x + 220 * dt);
      }
    }

    // 2. Update Player
    this.player.update(dt, this.particles);

    // 3. Update Level and wave spawns
    this.levelManager.update(dt);

    // 4. Update Parallax Background
    const scrollSpeed = this.player.canShoot ? 0 : (this.levelManager.currentLevel === 2 ? GAME_CONFIG.levels[2].speed : GAME_CONFIG.levels[1].speed);
    SpriteRenderer.updateBackground(dt, scrollSpeed);

    // 5. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy instanceof DepartmentExec) {
        enemy.update(dt, this.bullets, this.player, this.particles);
      } else if (enemy instanceof ArenaSeniorExec || enemy instanceof ArenaExecBoard || enemy instanceof GoverningBodyBoss) {
        enemy.update(dt, this.bullets, this.player, this.particles);
      } else {
        enemy.update(dt);
      }

      // Check collision with player (Runner mode: Level 1 and 2)
      if (!this.player.canShoot && !enemy.isDead) {
        if (this.checkAABBCollision(this.player, enemy)) {
          this.player.takeDamage(25, this.particles);
          this.ui.updateHUD();
          if (this.player.hp <= 0) {
            this.triggerGameOver();
            return;
          }
        }
      }

      if (enemy.isDead && (enemy instanceof RunnerGM || enemy instanceof DepartmentExec)) {
        this.enemies.splice(i, 1);
      }
    }

    // 6. Update Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Bouncing orb logic (GB General Secretary attack)
      if (b.pattern === "bouncing_orb") {
        if (b.y >= GAME_CONFIG.groundY - b.radius) {
          b.y = GAME_CONFIG.groundY - b.radius;
          b.vy = -Math.abs(b.vy) * 0.95; // bounce back up
        } else {
          b.vy += 350 * dt; // gravity on orb
        }
      }

      // Check bullet collisions
      if (b.isPlayer) {
        // Player bullet hits enemy (Level 3, 4, 5)
        for (const enemy of this.enemies) {
          if (!enemy.isDead && (enemy instanceof ArenaSeniorExec || enemy instanceof ArenaExecBoard || enemy instanceof GoverningBodyBoss)) {
            if (this.checkCircleBoxCollision(b, enemy)) {
              enemy.takeDamage(b.damage, this.particles);
              this.score += b.damage * 10;
              this.bullets.splice(i, 1);
              this.ui.updateHUD();
              break;
            }
          }
        }
      } else {
        // Enemy bullet hits player or active energy shield
        if (this.player.isShieldActive && this.player.shieldEnergy > 0) {
          const shieldBox = {
            x: this.player.x + this.player.width - 8,
            y: this.player.y - 14,
            width: 38,
            height: this.player.height + 28
          };
          if (this.checkCircleBoxCollision(b, shieldBox) || this.checkCircleBoxCollision(b, this.player)) {
            // Shield intercepts and blocks the upcoming bullet!
            this.player.absorbBulletDamage(b.damage, this.particles);
            this.bullets.splice(i, 1);
            this.ui.updateHUD();
            continue;
          }
        }

        // Unshielded bullet impact
        if (this.checkCircleBoxCollision(b, this.player)) {
          this.player.takeDamage(b.damage, this.particles);
          this.bullets.splice(i, 1);
          this.ui.updateHUD();
          if (this.player.hp <= 0) {
            this.triggerGameOver();
            return;
          }
        }
      }

      // Out of bounds check
      if (b.x < -30 || b.x > GAME_CONFIG.canvasWidth + 50 || b.y < -30 || b.y > GAME_CONFIG.canvasHeight + 30) {
        this.bullets.splice(i, 1);
      }
    }

    // Always update HUD to reflect smooth shield bar charge/drain
    this.ui.updateHUD();

    // 7. Update Particles
    this.particles.update(dt);

    // Continuous score increment while running
    if (!this.player.canShoot) {
      this.score += Math.floor(15 * dt);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Parallax Background
    SpriteRenderer.drawBackground(this.ctx, this.canvas.width, this.canvas.height, this.levelManager.currentLevel);

    // 2. Draw Floating Coins & Pickups
    this.levelManager.draw(this.ctx);

    // 3. Draw Enemies
    for (const enemy of this.enemies) {
      if (!enemy.isDead || (enemy instanceof ArenaSeniorExec || enemy instanceof ArenaExecBoard || enemy instanceof GoverningBodyBoss)) {
        enemy.draw(this.ctx);
      }
    }

    // 4. Draw Player
    SpriteRenderer.drawPlayer(this.ctx, this.player);

    // 5. Draw Bullets
    for (const b of this.bullets) {
      SpriteRenderer.drawBullet(this.ctx, b);
    }

    // 6. Draw Combat Particles & Damage text
    this.particles.draw(this.ctx);

    // 7. Draw Arena Aiming Crosshair in Level 3 & 4
    if (this.player.canShoot && this.state === "PLAYING") {
      this.drawCrosshair(this.ctx, this.mouseX, this.mouseY);
    }
  }

  drawCrosshair(ctx, x, y) {
    ctx.save();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 14, y);
    ctx.moveTo(x, y - 14);
    ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y + 14);
    ctx.stroke();

    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    ctx.restore();
  }

  // --- Collision Detection Utilities ---
  checkAABBCollision(rect1, rect2) {
    const margin = 8;
    return (
      rect1.x + margin < rect2.x + rect2.width - margin &&
      rect1.x + rect1.width - margin > rect2.x + margin &&
      rect1.y + margin < rect2.y + rect2.height - margin &&
      rect1.y + rect1.height - margin > rect2.y + margin
    );
  }

  checkCircleBoxCollision(circle, box) {
    const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    return distanceX * distanceX + distanceY * distanceY < circle.radius * circle.radius;
  }
}

// Global entry point
window.addEventListener("DOMContentLoaded", () => {
  ApiService.init();
  window.game = new GameEngine();
});
