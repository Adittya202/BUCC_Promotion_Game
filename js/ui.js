/**
 * BUCC Dino Runner & Boss Shooter - UI Manager
 * Handles HUD bindings, modals (Start, Promotion, Store, Game Over, Victory), and Leaderboard.
 */

class UIManager {
  constructor(game) {
    this.game = game;
    this.cacheElements();
    this.bindEvents();
  }

  cacheElements() {
    // HUD elements
    this.hudOverlay = document.getElementById("hudOverlay");
    this.hudPlayerName = document.getElementById("hudPlayerName");
    this.hudPlayerRank = document.getElementById("hudPlayerRank");
    this.hudBadgeImg = document.getElementById("hudBadgeImg");
    this.hudCoinCount = document.getElementById("hudCoinCount");
    this.hudHpFill = document.getElementById("hudHpFill");
    this.hudHpText = document.getElementById("hudHpText");
    this.hudShieldFill = document.getElementById("hudShieldFill");
    this.hudShieldVal = document.getElementById("hudShieldVal");
    this.hudObjTitle = document.getElementById("hudObjTitle");
    this.hudObjDetail = document.getElementById("hudObjDetail");
    this.hudWeaponWidget = document.getElementById("hudWeaponWidget");
    this.hudWeaponImg = document.getElementById("hudWeaponImg");
    this.hudCooldownText = document.getElementById("hudCooldownText");
    this.bossHudOverlay = document.getElementById("bossHudOverlay");

    // Screens / Modals
    this.startScreen = document.getElementById("startScreen");
    this.promotionModal = document.getElementById("promotionModal");
    this.storeModal = document.getElementById("storeModal");
    this.gameOverModal = document.getElementById("gameOverModal");
    this.victoryModal = document.getElementById("victoryModal");

    // Form inputs
    this.playerNameInput = document.getElementById("playerNameInput");
    this.startRankBadge = document.getElementById("startRankBadge");

    // Store elements
    this.storeCoinBalance = document.getElementById("storeCoinBalance");
    this.storeGrid = document.getElementById("storeWeaponGrid");

    // Leaderboard elements
    this.leaderboardBody = document.getElementById("leaderboardBody");
  }

  bindEvents() {
    // Start game button
    const btnStart = document.getElementById("btnStartGame");
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        const enteredName = this.playerNameInput.value.trim();
        this.game.playerName = enteredName.length > 0 ? enteredName : "General Member";
        this.game.player.name = this.game.playerName;
        this.game.startGame();
      });
    }

    // Name input auto-sync
    if (this.playerNameInput) {
      this.playerNameInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        this.game.playerName = val.length > 0 ? val : "General Member";
      });
    }

    // Promotion modal continue
    const btnContinuePromo = document.getElementById("btnContinuePromotion");
    if (btnContinuePromo) {
      btnContinuePromo.addEventListener("click", () => {
        this.hideAllModals();
        this.game.proceedAfterPromotion();
      });
    }

    // Store continue button
    const btnExitStore = document.getElementById("btnExitStore");
    if (btnExitStore) {
      btnExitStore.addEventListener("click", () => {
        this.hideAllModals();
        this.game.levelManager.startLevel(3);
        this.game.state = "PLAYING";
      });
    }

    // Restart game buttons
    const btnRestartList = document.querySelectorAll(".btn-restart-game");
    btnRestartList.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.hideAllModals();
        this.game.restartGame();
      });
    });

    // Audio mute buttons
    const muteBtns = document.querySelectorAll(".btn-toggle-mute");
    muteBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        Sounds.toggleMute();
      });
    });
  }

  showStartScreen() {
    this.hideAllModals();
    this.startScreen.classList.remove("hidden");
    this.hudOverlay.classList.add("hidden");
    this.loadLeaderboard();
  }

  showPromotionModal(levelNumber, message, nextRankKey) {
    this.hideAllModals();
    const rankInfo = GAME_CONFIG.ranks[nextRankKey] || GAME_CONFIG.ranks.EXECUTIVE;

    document.getElementById("promoTitle").innerText = "PROMOTION EARNED!";
    document.getElementById("promoMessage").innerText = message;
    document.getElementById("promoBadgeImg").src = rankInfo.badge;
    document.getElementById("promoRankName").innerText = rankInfo.name;

    this.promotionModal.classList.remove("hidden");
    Sounds.playPromotionFanfare();
    this.game.particles.burstConfetti(GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
  }

  showStoreModal() {
    this.hideAllModals();
    this.renderStoreWeapons();
    this.storeModal.classList.remove("hidden");
    Sounds.playCoin();
  }

  showGameOverModal() {
    this.hideAllModals();
    document.getElementById("goScore").innerText = this.game.score.toLocaleString();
    document.getElementById("goCoins").innerText = this.game.player.coins;
    document.getElementById("goRank").innerText = GAME_CONFIG.ranks[this.game.player.rank].name;

    this.gameOverModal.classList.remove("hidden");
    Sounds.playGameOver();

    // Auto-submit score to API/localStorage
    ApiService.submitScore({
      name: this.game.playerName,
      score: this.game.score,
      coins: this.game.player.coins,
      rank: GAME_CONFIG.ranks[this.game.player.rank].name,
      level_reached: this.game.levelManager.currentLevel,
      victory: false
    });
  }

  showVictoryModal() {
    this.hideAllModals();
    document.getElementById("vicScore").innerText = this.game.score.toLocaleString();
    document.getElementById("vicCoins").innerText = this.game.player.coins;

    this.victoryModal.classList.remove("hidden");
    Sounds.playVictory();
    this.game.particles.burstConfetti(GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // Auto-submit victory score
    ApiService.submitScore({
      name: this.game.playerName,
      score: this.game.score,
      coins: this.game.player.coins,
      rank: "Governing Body Leader",
      level_reached: 4,
      victory: true
    });
  }

  hideAllModals() {
    const screens = [
      this.startScreen,
      this.promotionModal,
      this.storeModal,
      this.gameOverModal,
      this.victoryModal
    ];
    screens.forEach((s) => {
      if (s) s.classList.add("hidden");
    });
  }

  updateHUD() {
    const player = this.game.player;
    const lm = this.game.levelManager;
    const lvl = lm.currentLevel;

    // Player Info
    this.hudPlayerName.innerText = this.game.playerName;
    const rankData = GAME_CONFIG.ranks[player.rank] || GAME_CONFIG.ranks.GM;
    this.hudPlayerRank.innerText = rankData.name;
    this.hudBadgeImg.src = rankData.badge;

    // Coins
    this.hudCoinCount.innerText = player.coins;

    // Health
    const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
    this.hudHpFill.style.width = `${hpPercent}%`;
    this.hudHpText.innerText = `${Math.ceil(player.hp)} / ${player.maxHp}`;
    if (hpPercent < 30) {
      this.hudHpFill.classList.add("danger");
    } else {
      this.hudHpFill.classList.remove("danger");
    }

    // Energy Shield
    if (this.hudShieldFill && this.hudShieldVal) {
      const shieldPct = Math.max(0, (player.shieldEnergy / player.shieldMaxEnergy) * 100);
      this.hudShieldFill.style.width = `${shieldPct}%`;
      if (player.isShieldBroken) {
        this.hudShieldFill.classList.add("broken");
        this.hudShieldVal.innerText = "OVERHEAT";
      } else {
        this.hudShieldFill.classList.remove("broken");
        this.hudShieldVal.innerText = `${Math.ceil(player.shieldEnergy)}%`;
      }
    }

    // Level Objective
    if (lvl === 1) {
      this.hudObjTitle.innerText = "STAGE 1: GM RUNNER";
      this.hudObjDetail.innerText = `GMs Dodged: ${lm.l1DodgedCount} / ${lm.l1TargetDodges}`;
      this.hudWeaponWidget.style.display = "none";
      this.bossHudOverlay.style.display = "none";
    } else if (lvl === 2) {
      const depts = GAME_CONFIG.departments;
      const currentDept = depts[lm.l2DeptIndex % depts.length];
      this.hudObjTitle.innerText = `STAGE 2: ${currentDept ? currentDept.name : "DEPT"} TRIAL`;
      this.hudObjDetail.innerText = `Execs Dodged: ${lm.l2DodgedTotal} / ${lm.l2TargetTotal}`;
      this.hudWeaponWidget.style.display = "none";
      this.bossHudOverlay.style.display = "none";
    } else if (lvl === 3) {
      this.hudObjTitle.innerText = "STAGE 3: ARENA DUEL";
      this.hudObjDetail.innerText = `SEs Defeated: ${lm.l3DefeatedCount} / 3`;
      this.hudWeaponWidget.style.display = "flex";
      this.bossHudOverlay.style.display = "none";
      this.updateWeaponWidget();
    } else if (lvl === 4) {
      this.hudObjTitle.innerText = "STAGE 4: THE FINAL STAND";
      this.hudObjDetail.innerText = `GB Leaders Defeated: ${lm.l4DefeatedCount} / 4`;
      this.hudWeaponWidget.style.display = "flex";
      this.bossHudOverlay.style.display = "flex";
      this.updateWeaponWidget();
      this.updateBossHudOverlay();
    }
  }

  updateWeaponWidget() {
    const player = this.game.player;
    const weapon = GAME_CONFIG.weapons[player.equippedWeapon] || GAME_CONFIG.weapons.pistol;
    this.hudWeaponImg.src = weapon.icon;

    if (player.shootCooldown > 0) {
      const pct = (player.shootCooldown / weapon.cooldown).toFixed(1);
      this.hudCooldownText.innerText = `${pct}s`;
      this.hudWeaponWidget.style.borderColor = "rgba(255, 51, 102, 0.5)";
    } else {
      this.hudCooldownText.innerText = "RDY";
      this.hudWeaponWidget.style.borderColor = "var(--color-primary)";
    }
  }

  updateBossHudOverlay() {
    const lm = this.game.levelManager;
    const bosses = lm.l4Bosses;
    let html = "";

    bosses.forEach((b) => {
      const hpPct = Math.max(0, (b.hp / b.maxHp) * 100);
      html += `
        <div class="boss-bar-row">
          <div class="boss-bar-name">${b.name}</div>
          <div class="boss-bar-track">
            <div class="boss-bar-fill" style="width: ${hpPct}%; background: ${b.color};"></div>
          </div>
          <div class="boss-bar-hp-text">${b.isDead ? "DOWN" : Math.ceil(b.hp)}</div>
        </div>
      `;
    });

    this.bossHudOverlay.innerHTML = html;
  }

  renderStoreWeapons() {
    const player = this.game.player;
    this.storeCoinBalance.innerText = player.coins;

    let html = "";
    Object.values(GAME_CONFIG.weapons).forEach((w) => {
      const isOwned = player.inventory.includes(w.id);
      const isEquipped = player.equippedWeapon === w.id;

      let btnHtml = "";
      if (isEquipped) {
        btnHtml = `<button class="btn-weapon-action btn-equipped" disabled>EQUIPPED</button>`;
      } else if (isOwned) {
        btnHtml = `<button class="btn-weapon-action btn-equip" onclick="window.game.equipWeapon('${w.id}')">EQUIP</button>`;
      } else {
        const canAfford = player.coins >= w.cost;
        btnHtml = `
          <button class="btn-weapon-action btn-buy" 
            ${canAfford ? "" : "disabled style='opacity:0.5; cursor:not-allowed;'"} 
            onclick="window.game.buyWeapon('${w.id}')">
            BUY (${w.cost} Coins)
          </button>`;
      }

      html += `
        <div class="weapon-card ${isEquipped ? "equipped" : ""} ${isOwned ? "purchased" : ""}">
          ${isEquipped ? `<span class="badge-equipped-tag">ACTIVE</span>` : ""}
          <div class="weapon-icon-box">
            <img src="${w.icon}" alt="${w.name}">
          </div>
          <div class="weapon-name">${w.name}</div>
          <div class="weapon-desc">${w.description}</div>
          <div class="weapon-stat-row"><span>Damage</span><span class="val">${w.damage}</span></div>
          <div class="weapon-stat-row"><span>Cycle Delay</span><span class="val">${w.cooldown}s</span></div>
          <div class="weapon-stat-row"><span>Velocity</span><span class="val">${w.speed}</span></div>
          ${btnHtml}
        </div>
      `;
    });

    this.storeGrid.innerHTML = html;
  }

  async loadLeaderboard() {
    const scores = await ApiService.getLeaderboard();
    if (!this.leaderboardBody) return;

    let rowsHtml = "";
    scores.slice(0, 5).forEach((s, idx) => {
      rowsHtml += `
        <tr>
          <td class="rank-cell">#${idx + 1}</td>
          <td><strong>${s.name}</strong></td>
          <td><span style="color:var(--color-gold);">${s.rank || "General Member"}</span></td>
          <td class="score-cell">${(s.score || 0).toLocaleString()}</td>
          <td>${s.coins || 0} C</td>
        </tr>
      `;
    });

    this.leaderboardBody.innerHTML = rowsHtml;
  }
}
