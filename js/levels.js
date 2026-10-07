/**
 * BUCC Dino Runner & Boss Shooter - Level Architecture & Wave Controller
 * Manages Stage 1 (GM Runner), Stage 2 (7 Departments + Gun Dodging + Gold Coins),
 * Intermission Store, Stage 3 (Stationary Arena Duel), and Stage 4 (4 GB Bosses).
 */

class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = 1;

    // Level 1 state
    this.l1DodgedCount = 0;
    this.l1SpawnedCount = 0;
    this.l1TargetDodges = GAME_CONFIG.levels[1].targetDodges || 7; // Exactly 7 GMs
    this.l1SpawnTimer = 0;

    // Level 2 state
    this.l2DeptIndex = 0;
    this.l2ExecIndex = 0;
    this.l2DodgedTotal = 0;
    this.l2TargetTotal = GAME_CONFIG.levels[2].targetDodges || 14; // 14 Department encounters
    this.l2SpawnTimer = 0;
    this.l2CoinSpawnTimer = 0;

    // Level 3 state
    this.l3Enemies = [];
    this.l3DefeatedCount = 0;

    // Level 4 state
    this.l4Bosses = [];
    this.l4DefeatedCount = 0;

    // Bonus coin pickups (Level 2)
    this.coins = [];
  }

  reset() {
    this.currentLevel = 1;
    this.l1DodgedCount = 0;
    this.l1SpawnedCount = 0;
    this.l1SpawnTimer = 1.0;

    this.l2DeptIndex = 0;
    this.l2ExecIndex = 0;
    this.l2DodgedTotal = 0;
    this.l2SpawnTimer = 1.2;
    this.l2CoinSpawnTimer = 0.5;

    this.l3Enemies = [];
    this.l3DefeatedCount = 0;

    this.l4Bosses = [];
    this.l4DefeatedCount = 0;

    this.coins = [];
  }

  startLevel(lvlNumber) {
    this.currentLevel = lvlNumber;
    this.coins = [];
    this.game.enemies = [];
    this.game.bullets = [];

    if (lvlNumber === 1) {
      this.l1DodgedCount = 0;
      this.l1SpawnedCount = 0;
      this.l1SpawnTimer = 1.2;
      this.game.player.setRank("GM");
      this.game.player.canShoot = false;
      this.game.player.x = 120;
    } else if (lvlNumber === 2) {
      this.l2DeptIndex = 0;
      this.l2ExecIndex = 0;
      this.l2DodgedTotal = 0;
      this.l2SpawnTimer = 1.2;
      this.l2CoinSpawnTimer = 0.8;
      this.game.player.setRank("EXECUTIVE");
      this.game.player.canShoot = false;
      this.game.player.x = 120;
    } else if (lvlNumber === 3) {
      // Stationary Arena Shooter
      this.game.player.setRank("SENIOR_EXECUTIVE");
      this.game.player.canShoot = true;
      this.game.player.x = 140;
      this.l3DefeatedCount = 0;
      this.initLevel3Enemies();
    } else if (lvlNumber === 4) {
      // 4 GB Bosses simultaneously
      this.game.player.setRank("EXECUTIVE_BOARD");
      this.game.player.canShoot = true;
      this.game.player.x = 130;
      this.l4DefeatedCount = 0;
      this.initLevel4Bosses();
      Sounds.playAlarm();
    }

    this.game.ui.updateHUD();
  }

  initLevel3Enemies() {
    this.l3Enemies = [];
    const seConfigs = GAME_CONFIG.levels[3].enemies;

    // Spawn 3 Senior Executives in the stationary arena
    const positions = [
      { x: 740, y: GAME_CONFIG.groundY - 70 },
      { x: 810, y: GAME_CONFIG.groundY - 70 },
      { x: 880, y: GAME_CONFIG.groundY - 70 }
    ];

    seConfigs.forEach((cfg, idx) => {
      const pos = positions[idx] || { x: 760 + idx * 50, y: GAME_CONFIG.groundY - 70 };
      const se = new ArenaSeniorExec(cfg, pos.x, pos.y);
      this.l3Enemies.push(se);
      this.game.enemies.push(se);
    });
  }

  initLevel4Bosses() {
    this.l4Bosses = [];
    const bossConfigs = GAME_CONFIG.levels[4].bosses;

    // Stagger all 4 GB bosses in combat positions simultaneously
    const positions = [
      { x: 700, y: GAME_CONFIG.groundY - 76 }, // President
      { x: 770, y: GAME_CONFIG.groundY - 76 }, // Vice President
      { x: 840, y: GAME_CONFIG.groundY - 76 }, // General Secretary
      { x: 910, y: GAME_CONFIG.groundY - 76 }  // Treasurer
    ];

    bossConfigs.forEach((cfg, idx) => {
      const pos = positions[idx];
      const boss = new GoverningBodyBoss(cfg, pos.x, pos.y);
      this.l4Bosses.push(boss);
      this.game.enemies.push(boss);
    });
  }

  update(dt) {
    if (this.currentLevel === 1) {
      this.updateLevel1(dt);
    } else if (this.currentLevel === 2) {
      this.updateLevel2(dt);
    } else if (this.currentLevel === 3) {
      this.updateLevel3(dt);
    } else if (this.currentLevel === 4) {
      this.updateLevel4(dt);
    }

    // Update floating coins (Level 2)
    this.updateCoins(dt);
  }

  // --- LEVEL 1 UPDATE ---
  updateLevel1(dt) {
    this.l1SpawnTimer -= dt;

    // Spawn 7 Runner GMs in sequence
    if (this.l1SpawnTimer <= 0 && this.l1SpawnedCount < this.l1TargetDodges) {
      const speed = GAME_CONFIG.levels[1].speed + Math.random() * 30;
      const gmList = GAME_CONFIG.gmMembers;
      const gmInfo = gmList[this.l1SpawnedCount % gmList.length];
      this.game.enemies.push(new RunnerGM(speed, gmInfo));
      this.l1SpawnedCount++;
      this.l1SpawnTimer = 1.8 + Math.random() * 0.8;
    }

    // Check dodged GMs
    for (const enemy of this.game.enemies) {
      if (!enemy.dodgedAwarded && enemy.x + enemy.width < this.game.player.x) {
        enemy.dodgedAwarded = true;
        this.l1DodgedCount++;
        this.game.score += 100;
        this.game.player.addCoins(GAME_CONFIG.levels[1].coinPerDodge, this.game.particles, enemy.x + 10, enemy.y);
        this.game.ui.updateHUD();

        // Level 1 Clear Condition: Dodge all 7 GMs
        if (this.l1DodgedCount >= this.l1TargetDodges) {
          this.game.triggerPromotion(1);
          return;
        }
      }
    }
  }

  // --- LEVEL 2 UPDATE ---
  updateLevel2(dt) {
    this.l2SpawnTimer -= dt;
    this.l2CoinSpawnTimer -= dt;

    // Spawn Department Executives across 7 departments (2 per department = 14 Executives total)
    if (this.l2SpawnTimer <= 0 && this.l2DodgedTotal < this.l2TargetTotal) {
      const depts = GAME_CONFIG.departments;
      const dept = depts[this.l2DeptIndex % depts.length];
      const execList = dept.executives;
      const memberInfo = execList[this.l2ExecIndex % execList.length];

      // High gun probability (85% chance) requiring tactical shield blocking
      const hasGun = Math.random() < 0.85;
      const speed = GAME_CONFIG.levels[2].speed + Math.random() * 30;

      this.game.enemies.push(new DepartmentExec(speed, dept, memberInfo, hasGun));

      this.l2ExecIndex++;
      if (this.l2ExecIndex >= execList.length) {
        this.l2ExecIndex = 0;
        this.l2DeptIndex++;
      }

      this.l2SpawnTimer = 1.6 + Math.random() * 0.8;
    }

    // Spawn bonus coins at varying heights along the run
    if (this.l2CoinSpawnTimer <= 0) {
      const heights = [
        GAME_CONFIG.groundY - 30, // ground jump
        GAME_CONFIG.groundY - 95, // mid jump
        GAME_CONFIG.groundY - 150 // high jump peak
      ];
      const randomY = heights[Math.floor(Math.random() * heights.length)];
      this.coins.push({
        x: GAME_CONFIG.canvasWidth + 20,
        y: randomY,
        radius: 9,
        speed: GAME_CONFIG.levels[2].speed,
        animTimer: Math.random() * 5,
        collected: false
      });
      this.l2CoinSpawnTimer = 2.0 + Math.random() * 2.5;
    }

    // Check dodged Department Executives
    for (const enemy of this.game.enemies) {
      if (!enemy.dodgedAwarded && enemy.x + enemy.width < this.game.player.x) {
        enemy.dodgedAwarded = true;
        this.l2DodgedTotal++;
        this.game.score += 250;
        this.game.player.addCoins(GAME_CONFIG.levels[2].coinPerDodge, this.game.particles, enemy.x + 10, enemy.y);
        this.game.ui.updateHUD();

        // Level 2 Clear Condition: Complete dodging all departmental waves (21 executives)
        if (this.l2DodgedTotal >= this.l2TargetTotal) {
          this.game.triggerStoreIntermission();
          return;
        }
      }
    }
  }

  // --- BONUS COINS IN LEVEL 2 ---
  updateCoins(dt) {
    const player = this.game.player;
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.x -= c.speed * dt;
      c.animTimer += dt;

      // Pickup collision with player
      const dist = Math.hypot(
        c.x - (player.x + player.width / 2),
        c.y - (player.y + player.height / 2)
      );

      if (dist < c.radius + player.width / 2) {
        c.collected = true;
        player.addCoins(2, this.game.particles, c.x, c.y);
        this.game.score += 150;
        this.coins.splice(i, 1);
        this.game.ui.updateHUD();
        continue;
      }

      if (c.x < -30) {
        this.coins.splice(i, 1);
      }
    }
  }

  // --- LEVEL 3 UPDATE (Arena Duel vs 3 Senior Execs) ---
  updateLevel3(dt) {
    let aliveCount = 0;
    for (const se of this.l3Enemies) {
      if (!se.isDead) {
        aliveCount++;
      }
    }

    this.l3DefeatedCount = this.l3Enemies.length - aliveCount;

    // Clear condition: Eliminate all 3 SEs
    if (aliveCount === 0 && this.l3Enemies.length > 0) {
      this.game.triggerPromotion(3);
    }
  }

  // --- LEVEL 4 UPDATE (The Final Stand vs 4 GB Bosses) ---
  updateLevel4(dt) {
    let aliveCount = 0;
    for (const boss of this.l4Bosses) {
      if (!boss.isDead) {
        aliveCount++;
      }
    }

    this.l4DefeatedCount = this.l4Bosses.length - aliveCount;

    // Victory condition: Defeat all 4 GB members
    if (aliveCount === 0 && this.l4Bosses.length > 0) {
      this.game.triggerVictory();
    }
  }

  draw(ctx) {
    // Draw coins
    for (const c of this.coins) {
      SpriteRenderer.drawCoin(ctx, c);
    }
  }
}
