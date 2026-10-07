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

    // Announcement elements
    this.announcementPopup = document.getElementById("announcementPopup");
    this.announcementCard = document.getElementById("announcementCard");
    this.announcementTitle = document.getElementById("announcementTitle");
    this.announcementSub = document.getElementById("announcementSub");

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
    // Load saved candidate name if previously typed
    const savedName = localStorage.getItem("bucc_player_name");
    if (savedName && this.playerNameInput) {
      this.playerNameInput.value = savedName;
      this.game.playerName = savedName;
    }

    // Start game button: Player must write their name at the beginning
    const btnStart = document.getElementById("btnStartGame");
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        const enteredName = this.playerNameInput ? this.playerNameInput.value.trim() : "";
        const errorMsg = document.getElementById("nameErrorMsg");
        if (!enteredName || enteredName.length === 0) {
          if (this.playerNameInput) {
            this.playerNameInput.classList.add("input-error");
            this.playerNameInput.focus();
          }
          if (errorMsg) errorMsg.classList.remove("hidden");
          return;
        }

        if (errorMsg) errorMsg.classList.add("hidden");
        if (this.playerNameInput) this.playerNameInput.classList.remove("input-error");

        this.game.playerName = enteredName;
        this.game.player.name = enteredName;
        localStorage.setItem("bucc_player_name", enteredName);

        // Immediately trigger background music on Start Game user gesture
        Sounds.hasUserInteracted = true;
        Sounds.ensureAudioContext();
        if (!Sounds.isMuted) {
          Sounds.playBgm();
        }

        this.game.startGame();
      });
    }

    // Name input auto-sync, error dismissal & Enter-key trigger
    if (this.playerNameInput) {
      this.playerNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (btnStart) btnStart.click();
        }
      });

      this.playerNameInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        const errorMsg = document.getElementById("nameErrorMsg");
        if (val.length > 0) {
          this.playerNameInput.classList.remove("input-error");
          if (errorMsg) errorMsg.classList.add("hidden");
          this.game.playerName = val;
          localStorage.setItem("bucc_player_name", val);
        }
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
        Sounds.ensureAudioContext();
        if (!Sounds.isMuted) {
          Sounds.playBgm();
        }
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

    // Auto-submit score to API/localStorage and update Top 5 Leaderboard
    ApiService.submitScore({
      name: this.game.playerName,
      score: this.game.score,
      coins: this.game.player.coins,
      rank: GAME_CONFIG.ranks[this.game.player.rank].name,
      level_reached: this.game.levelManager.currentLevel,
      victory: false
    }).then((res) => {
      this.loadLeaderboard();
      const rankBadge = document.getElementById("goRank");
      if (res && res.leaderboard_rank && res.leaderboard_rank <= 5) {
        if (rankBadge) {
          rankBadge.innerHTML = `${GAME_CONFIG.ranks[this.game.player.rank].name} <div class="top5-pill">&#127942; RANK #${res.leaderboard_rank} IN TOP 5!</div>`;
        }
      }
    });
  }

  showVictoryModal() {
    this.hideAllModals();
    document.getElementById("vicScore").innerText = this.game.score.toLocaleString();
    document.getElementById("vicCoins").innerText = this.game.player.coins;

    this.victoryModal.classList.remove("hidden");
    Sounds.playVictory();
    this.game.particles.burstConfetti(GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // Auto-submit victory score and update Top 5 Leaderboard
    ApiService.submitScore({
      name: this.game.playerName,
      score: this.game.score,
      coins: this.game.player.coins,
      rank: "Governing Body Leader",
      level_reached: 5,
      victory: true
    }).then((res) => {
      this.loadLeaderboard();
      const vicScoreEl = document.getElementById("vicScore");
      if (res && res.leaderboard_rank && res.leaderboard_rank <= 5) {
        if (vicScoreEl) {
          vicScoreEl.innerHTML = `${this.game.score.toLocaleString()} <div class="top5-pill">&#127942; RANK #${res.leaderboard_rank} IN TOP 5!</div>`;
        }
      }
    });
  }

  showAnnouncement(title, subtitle, color = "#00f0ff") {
    if (!this.announcementPopup || !this.announcementTitle) return;

    this.announcementTitle.innerText = title;
    if (this.announcementSub) {
      this.announcementSub.innerText = subtitle || "";
    }

    if (this.announcementCard) {
      this.announcementCard.style.setProperty("--announcement-color", color);
      this.announcementCard.style.setProperty("--announcement-glow", color + "80");
      this.announcementCard.style.animation = "none";
      this.announcementCard.offsetHeight; // trigger reflow
      this.announcementCard.style.animation = "";
    }

    this.announcementPopup.classList.remove("hidden");
  }

  hideAnnouncement() {
    if (this.announcementPopup) {
      this.announcementPopup.classList.add("hidden");
    }
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
    this.hideAnnouncement();
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
      this.hudObjTitle.innerText = `STAGE 2: EXECUTIVE RUNNER`;
      this.hudObjDetail.innerText = `Execs Dodged: ${lm.l2DodgedTotal} / ${lm.l2TargetTotal}`;
      this.hudWeaponWidget.style.display = "none";
      this.bossHudOverlay.style.display = "none";
    } else if (lvl === 3) {
      const depts = GAME_CONFIG.departments;
      const dept = depts[lm.l3DeptIndex] || depts[0];
      this.hudObjTitle.innerText = "STAGE 3: SENIOR EXECUTIVES";
      this.hudObjDetail.innerText = `${dept.name} (${Math.min(7, lm.l3DeptIndex + 1)}/7) • Defeated: ${lm.l3DefeatedCount} / 14`;
      this.hudWeaponWidget.style.display = "flex";
      this.bossHudOverlay.style.display = "none";
      this.updateWeaponWidget();
    } else if (lvl === 4) {
      const ebs = GAME_CONFIG.executiveBoardMembers;
      const eb = ebs[lm.l4DeptIndex] || ebs[0];
      this.hudObjTitle.innerText = "STAGE 4: EXECUTIVE BOARD";
      this.hudObjDetail.innerText = `${eb.deptName} (${Math.min(7, lm.l4DeptIndex + 1)}/7) • Defeated: ${lm.l4DefeatedCount} / 7`;
      this.hudWeaponWidget.style.display = "flex";
      this.bossHudOverlay.style.display = "none";
      this.updateWeaponWidget();
    } else if (lvl === 5) {
      this.hudObjTitle.innerText = "STAGE 5: GOVERNING BODY APEX";
      this.hudObjDetail.innerText = `GB Leaders Defeated: ${lm.l5DefeatedCount} / 4`;
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
    const bosses = lm.l5Bosses || [];
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

    const top5 = (scores || []).slice(0, 5);

    if (top5.length === 0) {
      this.leaderboardBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-leaderboard-cell" style="text-align: center; padding: 28px 12px; color: var(--text-muted); font-family: var(--font-tech);">
            <div style="font-size: 1.15rem; color: var(--color-cyan); margin-bottom: 6px;">&#9889; Awaiting First Contender</div>
            <div>No candidates recorded yet. Complete the promotion trials to secure your spot in the Top 5!</div>
          </td>
        </tr>
      `;
      return;
    }

    let rowsHtml = "";
    for (let i = 0; i < 5; i++) {
      if (i < top5.length) {
        const s = top5[i];
        const isCurrent = s.name === this.game.playerName;
        const rankColor = i === 0 ? "var(--color-gold)" : (i === 1 ? "#c0c0c0" : (i === 2 ? "#cd7f32" : "var(--color-cyan)"));
        rowsHtml += `
          <tr class="${isCurrent ? 'current-player-row' : ''}">
            <td class="rank-cell" style="color: ${rankColor}; font-weight: bold;">#${i + 1}</td>
            <td><strong>${s.name}</strong> ${isCurrent ? '<span class="you-badge">(YOU)</span>' : ''}</td>
            <td><span style="color:var(--color-gold); font-family: var(--font-tech);">${s.rank || "General Member"}</span></td>
            <td class="score-cell">${(s.score || 0).toLocaleString()}</td>
            <td>${s.coins || 0} C</td>
          </tr>
        `;
      } else {
        // Open contender slot up to 5
        rowsHtml += `
          <tr class="empty-rank-row" style="opacity: 0.4;">
            <td class="rank-cell">#${i + 1}</td>
            <td style="font-style: italic; color: var(--text-muted);">-- Open Contender Slot --</td>
            <td>-</td>
            <td class="score-cell">-</td>
            <td>-</td>
          </tr>
        `;
      }
    }

    this.leaderboardBody.innerHTML = rowsHtml;
  }
}
