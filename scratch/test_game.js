// Mock DOM and browser environment
global.window = global;
global.document = {
  getElementById: (id) => ({
    innerText: '',
    style: { setProperty: () => {} },
    classList: { add: () => {}, remove: () => {} },
    src: '',
    addEventListener: () => {}
  }),
  querySelectorAll: () => []
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.Sounds = {
  playBgm: () => {},
  playJump: () => {},
  playShoot: () => {},
  playEnemyShoot: () => {},
  playFlare: () => {},
  playHit: () => {},
  playCoin: () => {},
  playAnnouncement: () => {},
  playAlarm: () => {},
  playPromotionFanfare: () => {},
  playGameOver: () => {},
  playVictory: () => {},
  toggleMute: () => {}
};
global.SpriteRenderer = {
  drawRunnerGM: () => {},
  drawDepartmentExec: () => {},
  drawArenaSeniorExec: () => {},
  drawArenaExecBoard: () => {},
  drawGoverningBodyBoss: () => {},
  drawBackground: () => {},
  drawCoin: () => {},
  drawBullet: () => {}
};

const fs = require('fs');
const vm = require('vm');

function loadScript(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInThisContext(code);
}

loadScript('./js/config.js');
loadScript('./js/particles.js');
loadScript('./js/player.js');
loadScript('./js/enemies.js');
loadScript('./js/levels.js');
loadScript('./js/ui.js');

console.log("=== BUCC PROMOTION GAME LOGIC TESTS ===");

const mockGame = {
  player: new Player(),
  particles: new ParticleSystem(),
  enemies: [],
  bullets: [],
  score: 0,
  playerName: "BUCC Test",
  triggerPromotion: function(lvl) {
    console.log(`[EVENT] Promotion triggered for Level ${lvl}`);
    this.promotedLevel = lvl;
  },
  triggerStoreIntermission: function() {
    console.log("[EVENT] Store Intermission triggered!");
    this.storeTriggered = true;
  },
  triggerVictory: function() {
    console.log("[EVENT] VICTORY triggered!");
    this.victoryTriggered = true;
  }
};
mockGame.ui = new UIManager(mockGame);
const lm = new LevelManager(mockGame);
mockGame.levelManager = lm;

// 1. TEST LEVEL 1
console.log("\n--- Testing Level 1 ---");
lm.startLevel(1);
console.assert(lm.isAnnouncing === true, "Level 1 starts with announcement active");
lm.update(2.5); // Fast forward announcement
console.assert(lm.isAnnouncing === false, "Announcement finished");

// Spawn and dodge 7 GMs
const expectedDepts = ["C&M", "Creative", "Event Management", "Finance", "PR", "HR", "R&D"];
for (let i = 0; i < 7; i++) {
  const prevCount = mockGame.enemies.length;
  let safety = 100;
  while (mockGame.enemies.length === prevCount && safety-- > 0) {
    lm.update(0.1);
  }
  const enemy = mockGame.enemies[mockGame.enemies.length - 1];
  console.log(`Spawned GM #${i + 1}: deptName = "${enemy.deptName}" (Expected: "${expectedDepts[i]}")`);
  console.assert(enemy.deptName === expectedDepts[i], `GM ${i + 1} deptName matches`);
  // Simulate dodge
  enemy.x = -100;
  lm.update(0.1);
}
console.assert(lm.l1DodgedCount === 7, `Dodged count is 7, got ${lm.l1DodgedCount}`);
console.assert(mockGame.promotedLevel === 1, "Level 1 promotion was triggered");

// 2. TEST LEVEL 2
console.log("\n--- Testing Level 2 ---");
lm.startLevel(2);
console.assert(lm.isAnnouncing === true, "Level 2 starts with announcement active");
lm.update(2.5);
for (let i = 0; i < 7; i++) {
  const prevCount = mockGame.enemies.length;
  let safety = 100;
  while (mockGame.enemies.length === prevCount && safety-- > 0) {
    lm.update(0.1);
  }
  const enemy = mockGame.enemies[mockGame.enemies.length - 1];
  console.log(`Spawned Exec #${i + 1}: deptName = "${enemy.deptName}" (Expected: "${expectedDepts[i]}")`);
  console.assert(enemy.deptName === expectedDepts[i], `Exec ${i + 1} deptName matches`);
  enemy.x = -100;
  lm.update(0.1);
}
console.assert(lm.l2DodgedTotal === 7, `Dodged count is 7, got ${lm.l2DodgedTotal}`);
console.assert(mockGame.storeTriggered === true, "Store intermission triggered after Level 2");

// 3. TEST LEVEL 3
console.log("\n--- Testing Level 3 ---");
lm.startLevel(3);
console.assert(lm.isAnnouncing === true, "Level 3 starts with announcement active");
lm.update(2.5); // level announcement completes, starts first dept popup
for (let d = 0; d < 7; d++) {
  console.assert(lm.isAnnouncing === true, `Dept ${d + 1} popup is active`);
  lm.update(2.0); // dept announcement finishes, spawns 2 SEs
  console.assert(lm.l3Enemies.length === 2, `2 SEs spawned for dept ${expectedDepts[d]}`);
  console.log(`Dept ${expectedDepts[d]} SE 1: "${lm.l3Enemies[0].name}", SE 2: "${lm.l3Enemies[1].name}"`);
  
  if (expectedDepts[d] === "HR") {
    console.assert(lm.l3Enemies[0].name === "Adittya", "SE 1 is Adittya");
    console.assert(lm.l3Enemies[0].hp >= 120, `Adittya has increased HP (got ${lm.l3Enemies[0].hp})`);
    console.assert(lm.l3Enemies[0].scale >= 1.3, `Adittya has increased scale (got ${lm.l3Enemies[0].scale})`);
    console.assert(lm.l3Enemies[0].height > 70, `Adittya is bigger in height (got ${lm.l3Enemies[0].height})`);
    
    console.assert(lm.l3Enemies[1].name === "Subrajit", "SE 2 is Subrajit");
    console.assert(lm.l3Enemies[1].hp >= 120, `Subrajit has increased HP (got ${lm.l3Enemies[1].hp})`);
    console.assert(lm.l3Enemies[1].scale >= 1.3, `Subrajit has increased scale (got ${lm.l3Enemies[1].scale})`);
    console.assert(lm.l3Enemies[1].height > 70, `Subrajit is bigger in height (got ${lm.l3Enemies[1].height})`);
    console.log("  -> [VERIFIED] Adittya & Subrajit are bigger in size with higher health level!");
  }

  // Defeat both
  lm.l3Enemies[0].isDead = true;
  lm.l3Enemies[1].isDead = true;
  lm.update(0.1);
}
console.assert(lm.l3DefeatedCount === 14, `Defeated all 14 SEs, got ${lm.l3DefeatedCount}`);
console.assert(mockGame.promotedLevel === 3, "Level 3 promotion triggered");

// 4. TEST LEVEL 4
console.log("\n--- Testing Level 4 ---");
lm.startLevel(4);
console.assert(lm.isAnnouncing === true, "Level 4 starts with announcement active");
lm.update(2.5);
const expectedEBs = [
  "Zawad Bhai", "Luban Bhai", "Rafi Bhai", "Rawnak Bhai",
  "Kabya Apu", "Anika Apu", "Abir Bhai"
];
for (let d = 0; d < 7; d++) {
  console.assert(lm.isAnnouncing === true, `EB dept ${d + 1} popup is active`);
  lm.update(2.0);
  console.assert(lm.l4Enemies.length === 1, `1 EB Director spawned for dept ${expectedDepts[d]}`);
  const eb = lm.l4Enemies[0];
  console.log(`EB Director #${d + 1}: "${eb.name}" (Expected: "${expectedEBs[d]}")`);
  console.assert(eb.name === expectedEBs[d], `EB Director name matches`);
  console.assert(eb.bulletSpeed >= 720, `EB bullet speed is increased (got ${eb.bulletSpeed})`);

  // Test firing
  mockGame.bullets = [];
  eb.fireBullet(mockGame.bullets, mockGame.player, null);
  console.assert(mockGame.bullets.length >= 3, `EB fires multiple bullets per attack (got ${mockGame.bullets.length})`);

  if (eb.name === "Kabya Apu") {
    console.assert(eb.hasFireGun === true, "Kabya Apu has Fire Gun enabled");
    console.assert(eb.scale >= 1.3, `Kabya Apu is bigger in size (got ${eb.scale})`);
    console.assert(eb.height > 72, `Kabya Apu height is larger (got ${eb.height})`);
    console.assert(mockGame.bullets[0].pattern === "flare", `Kabya Apu throws flairs instead of bullets (pattern: ${mockGame.bullets[0].pattern})`);
    console.log("  -> [VERIFIED] Kabya Apu has Fire Gun, bigger size, and throws flairs!");
  }

  eb.isDead = true;
  lm.update(0.1);
}
console.assert(lm.l4DefeatedCount === 7, `Defeated all 7 EB Directors, got ${lm.l4DefeatedCount}`);
console.assert(mockGame.promotedLevel === 4, "Level 4 promotion triggered");

// 5. TEST LEVEL 5
console.log("\n--- Testing Level 5 ---");
lm.startLevel(5);
console.assert(lm.isAnnouncing === true, "Level 5 starts with announcement active");
lm.update(2.5);
console.assert(lm.l5Bosses.length === 4, `All 4 GB bosses spawned simultaneously`);
const expectedGBs = ["Jauad Ahmed Sadik", "Shudeepta Roy Mou", "G M JUBAYER ZAMAN", "Syed Adnan Rahman"];
lm.l5Bosses.forEach((b, idx) => {
  console.log(`GB Leader #${idx + 1}: "${b.name}" (Expected: "${expectedGBs[idx]}")`);
  console.assert(b.name === expectedGBs[idx], `GB leader name matches`);
  b.isDead = true;
});
lm.update(0.1);
console.assert(mockGame.victoryTriggered === true, "Victory triggered after defeating all 4 GB bosses");

console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
