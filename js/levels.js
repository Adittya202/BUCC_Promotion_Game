/**
 * BUCC Dino Runner & Boss Shooter - Level Architecture & Wave Controller
 * Manages Stage 1 (GM Runner), Stage 2 (7 Department Executives),
 * Intermission Store, Stage 3 (14 Senior Executives Arena Duel),
 * Stage 4 (7 Executive Board Directors Arena Duel), and
 * Stage 5 (All 4 Governing Body Leaders Simultaneously).
 */

class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevel = 1;

    // Announcement state
    this.isAnnouncing = false;
    this.announcementTimer = 0;
    this.announcementCallback = null;

    // Level 1 state (7 GMs consecutively, 1 per department)
    this.l1DodgedCount = 0;
    this.l1SpawnedCount = 0;
    this.l1TargetDodges = 7;
    this.l1SpawnTimer = 0;

    // Level 2 state (7 Department Executives consecutively)
    this.l2DeptIndex = 0;
    this.l2DodgedTotal = 0;
    this.l2TargetTotal = 7;
    this.l2SpawnTimer = 0;
    this.l2CoinSpawnTimer = 0;

    // Level 3 state (14 Senior Executives, 2 per department with department popup)
    this.l3DeptIndex = 0;
    this.l3Enemies = [];
    this.l3DefeatedCount = 0;

    // Level 4 state (7 Executive Board Directors, 1 per department with department popup)
    this.l4DeptIndex = 0;
    this.l4Enemies = [];
    this.l4DefeatedCount = 0;

    // Level 5 state (All 4 GB Leaders together)
    this.l5Bosses = [];
    this.l5DefeatedCount = 0;

    // Bonus coin pickups (Level 2)
    this.coins = [];
  }

  reset() {
    this.currentLevel = 1;
    this.isAnnouncing = false;
    this.announcementTimer = 0;
    this.announcementCallback = null;

    this.l1DodgedCount = 0;
    this.l1SpawnedCount = 0;
    this.l1SpawnTimer = 1.0;

    this.l2DeptIndex = 0;
    this.l2DodgedTotal = 0;
    this.l2SpawnTimer = 1.2;
    this.l2CoinSpawnTimer = 0.5;

    this.l3DeptIndex = 0;
    this.l3Enemies = [];
    this.l3DefeatedCount = 0;

    this.l4DeptIndex = 0;
    this.l4Enemies = [];
    this.l4DefeatedCount = 0;

    this.l5Bosses = [];
    this.l5DefeatedCount = 0;

    this.coins = [];
    if (this.game.ui) {
      this.game.ui.hideAnnouncement();
    }
  }

  showAnnouncement(title, subtitle, color, duration, callback) {
    this.isAnnouncing = true;
    this.announcementTimer = duration || 2.2;
    this.announcementCallback = callback || null;
    this.game.ui.showAnnouncement(title, subtitle, color);
    if (this.currentLevel === 5) {
      Sounds.playAlarm();
    } else {
      Sounds.playAnnouncement();
    }
  }

  startLevel(lvlNumber) {
    this.currentLevel = lvlNumber;
    this.coins = [];
    this.game.enemies = [];
    this.game.bullets = [];

    if (lvlNumber === 1) {
      this.l1DodgedCount = 0;
      this.l1SpawnedCount = 0;
      this.game.player.setRank("GM");
      this.game.player.canShoot = false;
      this.game.player.x = 120;
      // Pop up message: General Members are coming, then enemies will start coming
      this.showAnnouncement("General Members are coming", "Stage 1 Initiation • 7 Departments", "#00f0ff", 2.2, () => {
        this.l1SpawnTimer = 0.8;
      });
    } else if (lvlNumber === 2) {
      this.l2DeptIndex = 0;
      this.l2DodgedTotal = 0;
      this.game.player.setRank("EXECUTIVE");
      this.game.player.canShoot = false;
      this.game.player.x = 120;
      // In the beginning of the second level, pop up message that executives are coming, then enemies will start coming
      this.showAnnouncement("Executives are coming", "Stage 2 Department Gauntlet • Armed Suppression", "#ff9f1c", 2.2, () => {
        this.l2SpawnTimer = 0.9;
        this.l2CoinSpawnTimer = 0.8;
      });
    } else if (lvlNumber === 3) {
      // In the beginning of the 3rd level, write that Senior executives are coming
      this.game.player.setRank("SENIOR_EXECUTIVE");
      this.game.player.canShoot = true;
      this.game.player.x = 140;
      this.l3DeptIndex = 0;
      this.l3DefeatedCount = 0;
      this.l3Enemies = [];
      this.showAnnouncement("Senior executives are coming", "Stage 3 Arena Duel • 7 Departments Gauntlet", "#9b5de5", 2.2, () => {
        this.spawnLevel3DeptWave(0);
      });
    } else if (lvlNumber === 4) {
      // Level 4: Executive Board Members
      this.game.player.setRank("EXECUTIVE_BOARD");
      this.game.player.canShoot = true;
      this.game.player.x = 130;
      this.l4DeptIndex = 0;
      this.l4DefeatedCount = 0;
      this.l4Enemies = [];
      this.showAnnouncement("Executive Board Members are coming", "Stage 4 Arena Duel • 7 Board Directors", "#e056fd", 2.2, () => {
        this.spawnLevel4DeptWave(0);
      });
    } else if (lvlNumber === 5) {
      // In the last level, All four Governing Body members will come together
      this.game.player.setRank("EXECUTIVE_BOARD");
      this.game.player.canShoot = true;
      this.game.player.x = 130;
      this.l5DefeatedCount = 0;
      this.l5Bosses = [];
      this.showAnnouncement("All four Governing Body members will come together", "Stage 5 Apex Stand • BUCC Supreme Leadership", "#ffd166", 2.4, () => {
        this.initLevel5Bosses();
      });
    }

    this.game.ui.updateHUD();
  }

  // --- LEVEL 3: Senior Executives (Wave by department with department name popup) ---
  spawnLevel3DeptWave(deptIndex) {
    const depts = GAME_CONFIG.departments;
    if (deptIndex >= depts.length) {
      // All 7 departments cleared!
      this.game.triggerPromotion(3);
      return;
    }

    this.l3DeptIndex = deptIndex;
    const dept = depts[deptIndex];

    // Pop up every department name before their enemies come
    this.showAnnouncement(dept.name, "Senior Executives Duel", dept.themeColor || "#9b5de5", 1.8, () => {
      this.l3Enemies = [];
      const seList = dept.seniorExecutives || [];
      const positions = [
        { x: 740, y: GAME_CONFIG.groundY - 70 },
        { x: 830, y: GAME_CONFIG.groundY - 70 }
      ];

      seList.forEach((cfg, idx) => {
        const enemyCfg = Object.assign({}, cfg, { deptName: dept.name, color: dept.themeColor });
        const pos = positions[idx] || { x: 750 + idx * 70, y: GAME_CONFIG.groundY - 70 };
        const se = new ArenaSeniorExec(enemyCfg, pos.x, pos.y);
        this.l3Enemies.push(se);
        this.game.enemies.push(se);
      });

      this.game.ui.updateHUD();
    });
  }

  // --- LEVEL 4: Executive Board (Wave by department with department name popup) ---
  spawnLevel4DeptWave(deptIndex) {
    const ebList = GAME_CONFIG.executiveBoardMembers;
    if (deptIndex >= ebList.length) {
      // All 7 EB Directors cleared!
      this.game.triggerPromotion(4);
      return;
    }

    this.l4DeptIndex = deptIndex;
    const ebCfg = ebList[deptIndex];

    // Pop up every department name before their enemies come
    this.showAnnouncement(ebCfg.deptName, "Executive Board Member", ebCfg.color || "#e056fd", 1.8, () => {
      this.l4Enemies = [];
      const pos = { x: 770, y: GAME_CONFIG.groundY - 72 };
      const eb = new ArenaExecBoard(ebCfg, pos.x, pos.y);
      this.l4Enemies.push(eb);
      this.game.enemies.push(eb);
      this.game.ui.updateHUD();
    });
  }

  // --- LEVEL 5: All 4 Governing Body Leaders Simultaneously ---
  initLevel5Bosses() {
    this.l5Bosses = [];
    const bossConfigs = GAME_CONFIG.levels[5].bosses;

    const positions = [
      { x: 700, y: GAME_CONFIG.groundY - 76 }, // President (Jauad Ahmed Sadik)
      { x: 770, y: GAME_CONFIG.groundY - 76 }, // Vice President (Shudeepta Roy Mou)
      { x: 840, y: GAME_CONFIG.groundY - 76 }, // General Secretary (G M JUBAYER ZAMAN)
      { x: 910, y: GAME_CONFIG.groundY - 76 }  // Treasurer (Syed Adnan Rahman)
    ];

    bossConfigs.forEach((cfg, idx) => {
      const pos = positions[idx];
      const boss = new GoverningBodyBoss(cfg, pos.x, pos.y);
      this.l5Bosses.push(boss);
      this.game.enemies.push(boss);
    });

    Sounds.playAlarm();
    this.game.ui.updateHUD();
  }

  update(dt) {
    // Handle active announcement timer
    if (this.isAnnouncing) {
      this.announcementTimer -= dt;
      if (this.announcementTimer <= 0) {
        this.isAnnouncing = false;
        this.game.ui.hideAnnouncement();
        if (this.announcementCallback) {
          const cb = this.announcementCallback;
          this.announcementCallback = null;
          cb();
        }
      }
      return;
    }

    if (this.currentLevel === 1) {
      this.updateLevel1(dt);
    } else if (this.currentLevel === 2) {
      this.updateLevel2(dt);
    } else if (this.currentLevel === 3) {
      this.updateLevel3(dt);
    } else if (this.currentLevel === 4) {
      this.updateLevel4(dt);
    } else if (this.currentLevel === 5) {
      this.updateLevel5(dt);
    }

    // Update floating coins (Level 2)
    this.updateCoins(dt);
  }

  // --- LEVEL 1 UPDATE ---
  updateLevel1(dt) {
    if (this.isAnnouncing) return;

    this.l1SpawnTimer -= dt;

    // Spawn 7 Runner GMs in sequence, 1 per department
    if (this.l1SpawnTimer <= 0 && this.l1SpawnedCount < this.l1TargetDodges) {
      const speed = GAME_CONFIG.levels[1].speed + Math.random() * 25;
      const gmList = GAME_CONFIG.gmMembers;
      const gmInfo = gmList[this.l1SpawnedCount % gmList.length];
      this.game.enemies.push(new RunnerGM(speed, gmInfo));
      this.l1SpawnedCount++;
      this.l1SpawnTimer = 1.9 + Math.random() * 0.6;
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
    if (this.isAnnouncing) return;

    this.l2SpawnTimer -= dt;
    this.l2CoinSpawnTimer -= dt;

    // Spawn Department Executives across 7 departments consecutively
    if (this.l2SpawnTimer <= 0 && this.l2DodgedTotal < this.l2TargetTotal) {
      const depts = GAME_CONFIG.departments;
      const dept = depts[this.l2DeptIndex % depts.length];
      const execList = dept.executives;
      const memberInfo = execList[0] || { name: dept.name, title: "Executive" };

      // High gun probability (85% chance) requiring tactical shield blocking
      const hasGun = Math.random() < 0.85;
      const speed = GAME_CONFIG.levels[2].speed + Math.random() * 25;

      this.game.enemies.push(new DepartmentExec(speed, dept, memberInfo, hasGun));
      this.l2DeptIndex++;
      this.l2SpawnTimer = 1.8 + Math.random() * 0.6;
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

        // Level 2 Clear Condition: Complete dodging all 7 departmental executives
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

  // --- LEVEL 3 UPDATE (Arena Duel vs 14 Senior Execs across 7 departments) ---
  updateLevel3(dt) {
    if (this.isAnnouncing) return;

    if (this.l3Enemies.length > 0) {
      const alive = this.l3Enemies.filter(e => !e.isDead);
      if (alive.length === 0) {
        // Current department's 2 SEs defeated!
        this.game.enemies = this.game.enemies.filter(e => !(e instanceof ArenaSeniorExec && e.isDead));
        this.l3DefeatedCount += this.l3Enemies.length;
        this.l3Enemies = [];
        this.spawnLevel3DeptWave(this.l3DeptIndex + 1);
      }
    }
  }

  // --- LEVEL 4 UPDATE (Arena Duel vs 7 EB Directors across 7 departments) ---
  updateLevel4(dt) {
    if (this.isAnnouncing) return;

    if (this.l4Enemies.length > 0) {
      const alive = this.l4Enemies.filter(e => !e.isDead);
      if (alive.length === 0) {
        // Current department's EB Director defeated!
        this.game.enemies = this.game.enemies.filter(e => !(e instanceof ArenaExecBoard && e.isDead));
        this.l4DefeatedCount += this.l4Enemies.length;
        this.l4Enemies = [];
        this.spawnLevel4DeptWave(this.l4DeptIndex + 1);
      }
    }
  }

  // --- LEVEL 5 UPDATE (The Final Stand vs 4 GB Bosses) ---
  updateLevel5(dt) {
    if (this.isAnnouncing) return;

    let aliveCount = 0;
    for (const boss of this.l5Bosses) {
      if (!boss.isDead) {
        aliveCount++;
      }
    }

    this.l5DefeatedCount = this.l5Bosses.length - aliveCount;

    // Victory condition: Defeat all 4 GB members
    if (aliveCount === 0 && this.l5Bosses.length > 0) {
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
