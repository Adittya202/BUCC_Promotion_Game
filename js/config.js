/**
 * BUCC Dino Runner & Boss Shooter
 * Game Configuration & Modular Balance Parameters
 * Roster: 7 GMs, 14 Executives (2/dept), 14 Senior Executives (2/dept), 7 EBs, 4 GBs (together)
 */

const GAME_CONFIG = {
  title: "BRAC UNIVERSITY COMPUTER CLUB - Dino Runner & Boss Shooter",
  canvasWidth: 960,
  canvasHeight: 480,
  groundY: 410,
  gravity: 1250, // px / s^2
  jumpForce: -590, // px / s

  // Ranks
  ranks: {
    GM: {
      id: "GM",
      name: "General Member",
      badge: "assets/images/badges/gm-badge.svg",
      color: "#00f0ff"
    },
    EXECUTIVE: {
      id: "EXECUTIVE",
      name: "Executive",
      badge: "assets/images/badges/exec-badge.svg",
      color: "#ff9f1c"
    },
    SENIOR_EXECUTIVE: {
      id: "SENIOR_EXECUTIVE",
      name: "Senior Executive",
      badge: "assets/images/badges/sr-exec-badge.svg",
      color: "#9b5de5"
    },
    EXECUTIVE_BOARD: {
      id: "EXECUTIVE_BOARD",
      name: "Executive Board",
      badge: "assets/images/badges/eb-badge.svg",
      color: "#e056fd"
    },
    GOVERNING_BODY: {
      id: "GOVERNING_BODY",
      name: "Governing Body Leader",
      badge: "assets/images/badges/gb-badge.svg",
      color: "#ffd166"
    }
  },

  // Exactly 7 General Members (Level 1)
  // Exactly 7 General Members (Level 1) - One per department consecutively
  gmMembers: [
    { name: "C&M Member", deptName: "C&M", color: "#ff9f1c", title: "General Member" },
    { name: "Creative Member", deptName: "Creative", color: "#ff2a85", title: "General Member" },
    { name: "Event Mgmt Member", deptName: "Event Management", color: "#2ec4b6", title: "General Member" },
    { name: "Finance Member", deptName: "Finance", color: "#ffd166", title: "General Member" },
    { name: "PR Member", deptName: "PR", color: "#00b4d8", title: "General Member" },
    { name: "HR Member", deptName: "HR", color: "#9b5de5", title: "General Member" },
    { name: "R&D Member", deptName: "R&D", color: "#00f5d4", title: "General Member" }
  ],

  // 7 BUCC Departments in user-specified consecutive order:
  // C&M, Creative, Event Management, Finance, PR, HR, R&D
  departments: [
    {
      id: "cm",
      name: "C&M",
      fullName: "Communication & Marketing (C&M)",
      themeColor: "#ff9f1c",
      accentColor: "#ffbf69",
      executives: [
        { name: "Tahmid", title: "Officer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Md. Ishtiaq Mozumder", title: "Sr. Exec C&M", rank: "Senior Executive", hp: 60, fireRate: 1.8, speed: 460 },
        { name: "S.M.Abrar Shaleheen", title: "Sr. Exec C&M", rank: "Senior Executive", hp: 60, fireRate: 1.7, speed: 470 }
      ]
    },
    {
      id: "creative",
      name: "Creative",
      fullName: "Creative",
      themeColor: "#ff2a85",
      accentColor: "#ff70a6",
      executives: [
        { name: "Abrar", title: "Visual Designer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "MD. Mushfiqur Rahman", title: "Sr. Exec Creative", rank: "Senior Executive", hp: 60, fireRate: 1.8, speed: 460 },
        { name: "Mahajabin Islam", title: "Sr. Exec Creative", rank: "Senior Executive", hp: 60, fireRate: 1.7, speed: 470 }
      ]
    },
    {
      id: "em",
      name: "Event Management",
      fullName: "Event Management",
      themeColor: "#2ec4b6",
      accentColor: "#cbf3f0",
      executives: [
        { name: "Tanvir", title: "Logistics Officer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Fahim Faysal", title: "Sr. Exec Event Mgmt", rank: "Senior Executive", hp: 60, fireRate: 1.7, speed: 470 },
        { name: "Fahim Al Razy", title: "Sr. Exec Event Mgmt", rank: "Senior Executive", hp: 60, fireRate: 1.8, speed: 460 }
      ]
    },
    {
      id: "finance",
      name: "Finance",
      fullName: "Finance",
      themeColor: "#ffd166",
      accentColor: "#ffe494",
      executives: [
        { name: "Shakil", title: "Treasury Officer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Arnab", title: "Sr. Exec Finance", rank: "Senior Executive", hp: 60, fireRate: 1.8, speed: 460 },
        { name: "Raisa", title: "Sr. Exec Finance", rank: "Senior Executive", hp: 60, fireRate: 1.7, speed: 470 }
      ]
    },
    {
      id: "pr",
      name: "PR",
      fullName: "Public Relations (PR)",
      themeColor: "#00b4d8",
      accentColor: "#90e0ef",
      executives: [
        { name: "Rafid", title: "Liaison Officer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Tanisha", title: "Sr. Exec PR", rank: "Senior Executive", hp: 60, fireRate: 1.8, speed: 460 },
        { name: "Shovon Pr", title: "Sr. Exec PR", rank: "Senior Executive", hp: 60, fireRate: 1.7, speed: 470 }
      ]
    },
    {
      id: "hr",
      name: "HR",
      fullName: "Human Resources (HR)",
      themeColor: "#9b5de5",
      accentColor: "#b388ff",
      executives: [
        { name: "Tasnim", title: "Talent Officer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Adittya", title: "Sr. Exec HR", rank: "Senior Executive", hp: 60, fireRate: 1.8, speed: 460 },
        { name: "Subrajit", title: "Sr. Exec HR", rank: "Senior Executive", hp: 60, fireRate: 1.7, speed: 470 }
      ]
    },
    {
      id: "rnd",
      name: "R&D",
      fullName: "Research & Development (R&D)",
      themeColor: "#00f5d4",
      accentColor: "#7bf1a8",
      executives: [
        { name: "Dev", title: "Tech Specialist", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Mahir Dyan", title: "Sr. Exec R&D", rank: "Senior Executive", hp: 60, fireRate: 1.8, speed: 470 },
        { name: "Siam Ferdous", title: "Sr. Exec R&D", rank: "Senior Executive", hp: 60, fireRate: 1.7, speed: 480 }
      ]
    }
  ],

  // Exactly 7 Executive Board (EB) Members (1 from each department as listed by user)
  executiveBoardMembers: [
    { name: "Zawad Bhai", dept: "C&M", deptName: "C&M", title: "EB C&M Director", hp: 85, color: "#ff9f1c", fireRate: 1.6, speed: 480 },
    { name: "Luban Bhai", dept: "Creative", deptName: "Creative", title: "EB Creative Director", hp: 85, color: "#ff2a85", fireRate: 1.5, speed: 490 },
    { name: "Rafi Bhai", dept: "Event Management", deptName: "Event Management", title: "EB Event Operations Director", hp: 85, color: "#2ec4b6", fireRate: 1.6, speed: 480 },
    { name: "Rawnak Bhai", dept: "Finance", deptName: "Finance", title: "EB Treasury Director", hp: 85, color: "#ffd166", fireRate: 1.5, speed: 500 },
    { name: "Kabya Apu", dept: "HR", deptName: "HR", title: "EB Governance & HR Director", hp: 85, color: "#9b5de5", fireRate: 1.6, speed: 480 },
    { name: "Anika Apu", dept: "PR", deptName: "PR", title: "EB PR Director", hp: 85, color: "#00b4d8", fireRate: 1.5, speed: 490 },
    { name: "Abir Bhai", dept: "R&D", deptName: "R&D", title: "EB Technology Director", hp: 90, color: "#00f5d4", fireRate: 1.4, speed: 510 }
  ],

  // Exactly 4 Governing Body (GB) Members (All 4 together in the last level)
  governingBody: [
    {
      id: "gb_president",
      name: "Jauad Ahmed Sadik",
      title: "President",
      hp: 240,
      color: "#ff0055",
      pattern: "spread",
      fireRate: 1.7,
      bulletSpeed: 520
    },
    {
      id: "gb_vp",
      name: "Shudeepta Roy Mou",
      title: "Vice President",
      hp: 210,
      color: "#00d2ff",
      pattern: "dual_burst",
      fireRate: 1.5,
      bulletSpeed: 560
    },
    {
      id: "gb_gs",
      name: "G M JUBAYER ZAMAN",
      title: "General Secretary",
      hp: 190,
      color: "#a855f7",
      pattern: "bouncing_orb",
      fireRate: 1.9,
      bulletSpeed: 480
    },
    {
      id: "gb_treasurer",
      name: "Syed Adnan Rahman",
      title: "Treasurer",
      hp: 180,
      color: "#ffd166",
      pattern: "cluster_barrage",
      fireRate: 2.0,
      bulletSpeed: 500
    }
  ],

  // Weapons Configuration (Shop lowest price is 50 coins)
  weapons: {
    pistol: {
      id: "pistol",
      name: "Standard Pistol",
      cost: 0,
      damage: 16,
      cooldown: 0.5,
      speed: 720,
      color: "#00f0ff",
      size: 4,
      icon: "assets/images/weapons/pistol.svg",
      description: "Standard issued club sidearm. Reliable base damage with 0.5s cooldown."
    },
    blaster: {
      id: "blaster",
      name: "Rapid Blaster",
      cost: 50, // Lowest shop price is 50 coins
      damage: 26,
      cooldown: 0.35,
      speed: 950,
      color: "#ff007f",
      size: 5,
      icon: "assets/images/weapons/blaster.svg",
      description: "Accelerated cycle time & rapid fire suppression for high-octane duels."
    },
    cannon: {
      id: "cannon",
      name: "Heavy Cannon",
      cost: 90, // Heavy upgraded cannon
      damage: 60,
      cooldown: 0.5,
      speed: 680,
      color: "#ffd166",
      size: 8,
      icon: "assets/images/weapons/cannon.svg",
      description: "Electromagnetic plasma cannon. Massive impact damage per plasma shell."
    }
  },

  // Level Progression Configuration (5 Levels)
  levels: {
    1: {
      id: 1,
      title: "Level 1: GM to Executive",
      subtitle: "Classic Endless Runner Trials",
      announcement: "General Members are coming",
      targetDodges: 7, // Exactly 7 GMs total (1 from each department consecutively)
      coinPerDodge: 1,
      speed: 310,
      playerRank: "GM",
      nextRank: "EXECUTIVE",
      promotionMessage: "Congratulations, You have been promoted from GM to Executive!"
    },
    2: {
      id: 2,
      title: "Level 2: Executive to Senior Executive",
      subtitle: "7 BUCC Department Gauntlet & High-Velocity Fire",
      announcement: "Executives are coming",
      targetDodges: 7, // Exactly 7 Department Executives consecutively
      coinPerDodge: 4,
      speed: 360,
      playerRank: "EXECUTIVE",
      nextRank: "SENIOR_EXECUTIVE",
      promotionMessage: "Outstanding! You cleared all department trials and advanced to Senior Executive!"
    },
    3: {
      id: 3,
      title: "Level 3: Senior Executive to Executive Board (EB)",
      subtitle: "Stationary Arena Duel vs 14 Senior Executives",
      announcement: "Senior executives are coming",
      playerRank: "SENIOR_EXECUTIVE",
      nextRank: "EXECUTIVE_BOARD",
      promotionMessage: "Promoted to Executive Board (EB)!"
    },
    4: {
      id: 4,
      title: "Level 4: Executive Board Trial",
      subtitle: "Stationary Arena Duel vs 7 Executive Board Directors",
      announcement: "Executive Board Members are coming",
      playerRank: "EXECUTIVE_BOARD",
      nextRank: "GOVERNING_BODY",
      promotionMessage: "Outstanding! You conquered the Executive Board! Qualified for Governing Body Trials!"
    },
    5: {
      id: 5,
      title: "Level 5: The Final Stand — Governing Body (GB)",
      subtitle: "Apex Boss Battle: All 4 Governing Body Members Simultaneously",
      announcement: "Governing Body Members are coming",
      playerRank: "EXECUTIVE_BOARD",
      nextRank: "GOVERNING_BODY",
      promotionMessage: "VICTORY! You defeated all 4 Governing Body Leaders and claimed BUCC Leadership!",
      bosses: [
        {
          id: "gb_president",
          name: "Jauad Ahmed Sadik",
          title: "President",
          hp: 240,
          color: "#ff0055",
          pattern: "spread",
          fireRate: 1.7,
          bulletSpeed: 520
        },
        {
          id: "gb_vp",
          name: "Shudeepta Roy Mou",
          title: "Vice President",
          hp: 210,
          color: "#00d2ff",
          pattern: "dual_burst",
          fireRate: 1.5,
          bulletSpeed: 560
        },
        {
          id: "gb_gs",
          name: "G M JUBAYER ZAMAN",
          title: "General Secretary",
          hp: 190,
          color: "#a855f7",
          pattern: "bouncing_orb",
          fireRate: 1.9,
          bulletSpeed: 480
        },
        {
          id: "gb_treasurer",
          name: "Syed Adnan Rahman",
          title: "Treasurer",
          hp: 180,
          color: "#ffd166",
          pattern: "cluster_barrage",
          fireRate: 2.0,
          bulletSpeed: 500
        }
      ]
    }
  }
};
