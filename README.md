# BUCC Dino Runner & Boss Shooter Web Game

An arcade runner and boss shooter web game themed around the **BRAC University Computer Club (BUCC)** promotional hierarchy. Built with HTML5 Canvas, Vanilla CSS3, Vanilla JavaScript, and a lightweight PHP backend for scoring and session management.

---

## 🌟 Game Overview

Start as a humble **General Member (GM)** and rise through the club's ranks by surviving challenges, dodging fellow members and projectiles, purchasing weapon upgrades, and confronting the apex leadership of BUCC!

### 🎖️ Promotional Hierarchy & Stages

1. **Stage 1: GM to Executive (Classic Endless Runner Trials)**
   - **Role**: General Member (GM).
   - **Mechanics**: Auto-running rightward. Jump (`Spacebar` or `Up Arrow` / Click) to clear fellow GMs approaching at ground level.
   - **Enemies**: **7 distinct named GM candidates** (`GM Tanvir`, `GM Sadia`, `GM Rayan`, `GM Lamia`, `GM Faisal`, `GM Tasnim`, `GM Nafis`).
   - **Rewards**: Each dodged GM awards **+1 Coin**.
   - **Promotion**: Dodge **7 GMs** to trigger promotion: `"Congratulations, You have been promoted from GM to Executive!"`.

2. **Stage 2: Executive to Senior Executive (7 BUCC Department Gauntlet)**
   - **Role**: Executive.
   - **Enemies**: The 7 official BUCC departments (*Creative, C&M, Event Management, Finance, HR, PR, R&D*), featuring **14 Senior Executives** (**2 from each department**) alongside departmental executives.
   - **Mechanics**: Executives and Senior Executives approach the player. Certain members wield firearms and shoot high-velocity bullets towards the player.
   - **Rewards**: Dodging an executive awards **+3 Coins**. Floating gold coins also spawn at varying heights along the run.
   - **Completion**: Dodge 14 departmental executives & senior executives to enter **The Promotion Store**.

3. **Intermission: The Promotion Store**
   - Spend collected coins to upgrade your tactical arsenal before arena combat:
     - **Standard Pistol** (Default/Free): 16 Damage, 0.5s Cooldown, Velocity 720.
     - **Rapid Blaster** (25 Coins): 24 Damage, 0.35s Cooldown, Velocity 900.
     - **Heavy Cannon** (50 Coins): 55 Damage, 0.5s Cooldown, Velocity 620.
   - Equip owned weapons and advance to Level 3.

4. **Stage 3: Senior Executive to Executive Board (Stationary Arena Duel)**
   - **Role**: Senior Executive.
   - **Mechanics**: Auto-running stops; transitions into a stationary arena shooter.
   - **Controls**: Aim with mouse cursor, shoot with `Left Click` or `F` key (strict 0.5s cooldown). Maneuver with `A`/`D` or `Left`/`Right` arrow keys and jump with `Spacebar` to dodge incoming bullets.
   - **Objective**: Defeat 3 Senior Executives with active HP bars to earn promotion to **Executive Board (EB)**!

5. **Stage 4: The Final Stand — EB to Governing Body (Apex Boss Battle)**
   - **Role**: Executive Board (EB).
   - **Bosses**: Exactly **4 Governing Body (GB) members** entering simultaneously:
     - **GB President**: High HP, 3-way spread energy bursts.
     - **GB Vice President**: High HP, dual high-speed laser pulses.
     - **GB General Secretary**: High HP, bouncing orb projectile.
     - **GB Treasurer**: High HP, golden cluster coin barrage.
   - **Victory Condition**: Eliminate all 4 GB bosses to win the game and claim club leadership as **Governing Body President**!

---

## 🕹️ Controls Guide

| Action | Runner Stages (Level 1 & 2) | Arena Shooter (Level 3 & 4) |
|---|---|---|
| **Jump / Dodge** | `Spacebar` / `Up Arrow` / Click / Touch | `Spacebar` / `Up Arrow` / Touch |
| **Tactical Movement** | N/A (Auto-runner) | `A` / `D` or `Left` / `Right` Arrow |
| **Aim** | N/A | Mouse cursor tracking |
| **Shoot** | N/A | `Left Click` or `F` Key (0.5s cooldown) |
| **Mute / Audio Toggle** | Audio icon button in Header | Audio icon button in Header |

---

## 📂 File Architecture

```
BUCC_Promotion_Game/
├── index.php                 # PHP entry point with session tracking & CSRF validation
├── index.html                # Standalone HTML entry point (for static previews)
├── config.php                # Master PHP configuration (ranks, departments, weapons, balance)
├── README.md                 # Project documentation
│
├── api/
│   ├── config.php            # REST endpoint returning game balance config in JSON
│   ├── scores.php            # REST endpoint for GET/POST high score leaderboard
│   └── session.php           # Session initialization & player security token
│
├── data/
│   └── scores.json           # JSON high score database
│
├── assets/
│   ├── audio/
│   │   └── bgm.mp3           # Looping background music track
│   └── images/
│       ├── bucc-logo.svg     # BUCC cyber crest emblem
│       ├── badges/           # GM, Exec, Sr. Exec, EB, and GB rank badges
│       └── weapons/          # Pistol, Blaster, and Cannon vector graphics
│
├── css/
│   ├── style.css             # Cyberpunk design system, HUD overlays, modals, typography
│   └── animations.css        # Screen shake, damage flashes, neon pulses, confetti
│
└── js/
    ├── config.js             # Client-side configuration & departmental executive data
    ├── api.js                # API client with automatic localStorage fallback
    ├── audio.js              # Audio system (HTML5 Audio + Web Audio procedural SFX & synth)
    ├── particles.js          # Running dust, muzzle flashes, sparks, floating damage text, confetti
    ├── sprites.js            # Procedural Canvas 2D sprites, characters, & parallax campus skyline
    ├── player.js             # Player physics, jumping, HP, inventory, and weapon cooldowns
    ├── enemies.js            # Runner GMs, Department Execs, Arena SEs, and 4 GB Bosses
    ├── levels.js             # Level architecture, wave controller, and promotion triggers
    ├── ui.js                 # UI manager for HUD, modals, store, and leaderboard
    └── game.js               # Game loop, input handling, combat collisions, state machine
```

---

## 🚀 How to Run Locally

### Option 1: With PHP (Recommended)
1. Using the built-in PHP development server:
   ```bash
   php -S localhost:8000
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:8000/
   ```

### Option 2: With XAMPP / WAMP / Apache
1. Copy or clone the `BUCC_Promotion_Game` folder into your web root (e.g. `C:\xampp\htdocs\BUCC_Promotion_Game`).
2. Navigate to:
   ```
   http://localhost/BUCC_Promotion_Game/
   ```

### Option 3: Standalone Static Browser (Zero Setup)
- Simply double-click `index.html` or open it in any web browser!
- The built-in client storage (`js/api.js`) automatically switches to browser `localStorage` for high scores if PHP is not detected.

---

## 🔊 Audio & Soundtrack
- **Background Music**: Local audio asset `assets/audio/bgm.mp3` with continuous looping.
- **Auto-unlock**: Audio starts playing smoothly upon first interaction (click or keypress).
- **Procedural Sound FX**: Web Audio API generates crisp retro arcade sounds for jumping, laser blasts, coin pickups, damage hits, boss sirens, promotion fanfares, and victory melodies.
- **Fail-safe Synth**: If local file playback is blocked by browser security policies, an integrated Web Audio synthesizer seamlessly provides chiptune background music.
