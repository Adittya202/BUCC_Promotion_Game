# BUCC Dino Runner & Boss Shooter Web Game

An arcade runner and boss shooter web game themed around the **BRAC University Computer Club (BUCC)** promotional hierarchy. Built with HTML5 Canvas, Vanilla CSS3, Vanilla JavaScript, and a lightweight PHP backend for scoring and session management.

---

## 🌟 Game Overview

Start as a humble **General Member (GM)** and rise through the club's ranks by surviving challenges, dodging fellow members and projectiles, purchasing weapon upgrades, and confronting the apex leadership of BUCC!

### 🎖️ Promotional Hierarchy & Stages

1. **Stage 1: GM to Executive (Classic Endless Runner Trials)**
   - **Role**: General Member (GM).
   - **Announcement**: `"General Members are coming"` banner alert precedes the wave.
   - **Mechanics**: Auto-running rightward. Jump (`Spacebar` or `Up Arrow` / Click) to clear fellow GMs.
   - **Enemies**: **7 enemies** representing the 7 official BUCC departments consecutively (*C&M, Creative, Event Management, Finance, PR, HR, R&D*), with department names written above each enemy's head.
   - **Promotion**: Dodge **7 GMs** to earn promotion to **Executive**.

2. **Stage 2: Executive to Senior Executive (7 BUCC Department Gauntlet)**
   - **Role**: Executive.
   - **Announcement**: `"Executives are coming"` banner alert precedes the wave.
   - **Enemies**: **7 Department Executives** consecutively (*C&M, Creative, Event Management, Finance, PR, HR, R&D*), with department names written above their heads similar to General Members.
   - **Mechanics**: Armed executives fire high-velocity suppression rounds; hold `Right Click` to block with the Holographic Shield.
   - **Completion**: Dodge 7 department executives to enter **The Promotion Store**.

3. **Intermission: The Promotion Store**
   - Spend collected coins to upgrade weapons before entering the arena:
     - **Standard Pistol** (Free): 16 Damage, 0.5s Cooldown, Velocity 720.
     - **Rapid Blaster** (50 Coins): 26 Damage, 0.35s Cooldown, Velocity 950.
     - **Heavy Cannon** (90 Coins): 60 Damage, 0.5s Cooldown, Velocity 680.

4. **Stage 3: Senior Executive Arena Duel (14 Senior Executives)**
   - **Role**: Senior Executive.
   - **Announcement**: `"Senior executives are coming"` announcement at the start.
   - **Department Announcements**: Before each department's wave, that department's name pops up (*C&M, Creative, Event Management, Finance, PR, HR, R&D*).
   - **Enemies**: **14 Senior Executives** (2 per department) with names displayed above their heads:
     - **C&M**: Md. Ishtiaq Mozumder, S.M.Abrar Shaleheen
     - **Creative**: MD. Mushfiqur Rahman, Mahajabin Islam
     - **Event Management**: Fahim Faysal, Fahim Al Razy
     - **Finance**: Arnab, Raisa
     - **PR**: Tanisha, Shovon Pr
     - **HR**: Adittya, Subrajit
     - **R&D**: Mahir Dyan, Siam Ferdous
   - **Promotion**: Defeat all 14 Senior Executives to earn promotion to **Executive Board (EB)**!

5. **Stage 4: Executive Board Trial (7 EB Directors)**
   - **Role**: Executive Board (EB).
   - **Announcement**: `"Executive Board Members are coming"`, followed by department popups before each director enters:
     - **C&M**: Zawad Bhai
     - **Creative**: Luban Bhai
     - **Event Management**: Rafi Bhai
     - **Finance**: Rawnak Bhai
     - **HR**: Kabya Apu
     - **PR**: Anika Apu
     - **R&D**: Abir Bhai
   - **Promotion**: Defeat all 7 EB Directors to qualify for Governing Body Trials!

6. **Stage 5: The Final Stand — Governing Body (Apex Boss Battle)**
   - **Role**: Executive Board Champion.
   - **Announcement**: `"All four Governing Body members will come together"`.
   - **Bosses**: Exactly **4 Governing Body members entering simultaneously**:
     - **Jauad Ahmed Sadik** (President): High HP, 3-way spread energy bursts.
     - **Shudeepta Roy Mou** (Vice President): High HP, dual high-speed laser pulses.
     - **G M JUBAYER ZAMAN** (General Secretary): High HP, bouncing energy orb.
     - **Syed Adnan Rahman** (Treasurer): High HP, cluster coin barrage.
   - **Victory Condition**: Eliminate all 4 GB leaders to win and claim club leadership as **Governing Body President**!

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
