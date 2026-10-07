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
  gmMembers: [
    { name: "GM Tanvir Rookie", title: "Freshman Member" },
    { name: "GM Sadia Python", title: "Code Apprentice" },
    { name: "GM Rayan Hardware", title: "Lab Trainee" },
    { name: "GM Lamia Algorist", title: "Problem Solver" },
    { name: "GM Faisal Frontend", title: "Web Novice" },
    { name: "GM Tasnim Git", title: "Version Control Trainee" },
    { name: "GM Nafis Creative", title: "Junior Designer" }
  ],

  // 7 BUCC Departments
  // Exactly 2 Executives per department = 14 Executives Total
  // Exactly 2 Senior Executives per department = 14 Senior Executives Total
  departments: [
    {
      id: "creative",
      name: "Creative",
      themeColor: "#ff2a85",
      accentColor: "#ff70a6",
      executives: [
        { name: "Abrar Design", title: "Visual Director", rank: "Executive" },
        { name: "Farzana Canvas", title: "Illustrator Exec", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Tanha Aesthetics", title: "Sr. Exec Visual Arts", rank: "Senior Executive" },
        { name: "Fahim Layout", title: "Sr. Exec Publications", rank: "Senior Executive" }
      ]
    },
    {
      id: "cm",
      name: "Communication & Marketing (C&M)",
      themeColor: "#ff9f1c",
      accentColor: "#ffbf69",
      executives: [
        { name: "Tahmid Outreach", title: "C&M Lead Exec", rank: "Executive" },
        { name: "Sarah Campaign", title: "Content Strategist", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Arif Engage", title: "Sr. Exec Communications", rank: "Senior Executive" },
        { name: "Tasnia Promo", title: "Sr. Exec Brand Outreach", rank: "Senior Executive" }
      ]
    },
    {
      id: "em",
      name: "Event Management",
      themeColor: "#2ec4b6",
      accentColor: "#cbf3f0",
      executives: [
        { name: "Tanvir Logistics", title: "Venue Coordinator", rank: "Executive" },
        { name: "Sadia Stage", title: "Protocol Officer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Shakil Decor", title: "Sr. Exec Stage & Venue", rank: "Senior Executive" },
        { name: "Ishraq Planner", title: "Sr. Exec Event Logistics", rank: "Senior Executive" }
      ]
    },
    {
      id: "finance",
      name: "Finance",
      themeColor: "#ffd166",
      accentColor: "#ffe494",
      executives: [
        { name: "Shakil Ledger", title: "Budget Master", rank: "Executive" },
        { name: "Nafisa Audit", title: "Treasury Officer", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Faisal Fiscal", title: "Sr. Exec Treasury", rank: "Senior Executive" },
        { name: "Samira Audit", title: "Sr. Exec Financial Compliance", rank: "Senior Executive" }
      ]
    },
    {
      id: "hr",
      name: "Human Resources (HR)",
      themeColor: "#9b5de5",
      accentColor: "#b388ff",
      executives: [
        { name: "Tasnim Recruiter", title: "Talent Acquisition", rank: "Executive" },
        { name: "Arif Personnel", title: "Member Relations", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Nayeem Talent", title: "Sr. Exec HR Operations", rank: "Senior Executive" },
        { name: "Sabrina Mentor", title: "Sr. Exec Member Development", rank: "Senior Executive" }
      ]
    },
    {
      id: "pr",
      name: "Public Relations (PR)",
      themeColor: "#00b4d8",
      accentColor: "#90e0ef",
      executives: [
        { name: "Rafid Diplomat", title: "Club Spokesperson", rank: "Executive" },
        { name: "Samira Press", title: "External Liaison", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Arham Emissary", title: "Sr. Exec External Relations", rank: "Senior Executive" },
        { name: "Shreya Press", title: "Sr. Exec Media Relations", rank: "Senior Executive" }
      ]
    },
    {
      id: "rnd",
      name: "Research & Development (R&D)",
      themeColor: "#00f5d4",
      accentColor: "#7bf1a8",
      executives: [
        { name: "Adittya Dev", title: "Core Systems Architect", rank: "Executive" },
        { name: "Mahir Kernel", title: "Full-Stack Specialist", rank: "Executive" }
      ],
      seniorExecutives: [
        { name: "Emon Backend", title: "Sr. Exec Software Engineering", rank: "Senior Executive" },
        { name: "Towhid Frontend", title: "Sr. Exec Web Technologies", rank: "Senior Executive" }
      ]
    }
  ],

  // Exactly 7 Executive Board (EB) Members (1 from each department)
  executiveBoardMembers: [
    { name: "Director Sabrina Chroma", dept: "Creative", title: "EB Creative Director", color: "#ff2a85" },
    { name: "Director Rayhan Growth", dept: "C&M", title: "EB Strategic Outreach Lead", color: "#ff9f1c" },
    { name: "Director Tanjim Protocol", dept: "Event Management", title: "EB Event Operations Lead", color: "#2ec4b6" },
    { name: "Director Rehan Forecast", dept: "Finance", title: "EB Treasury Director", color: "#ffd166" },
    { name: "Director Tariq Ethics", dept: "Human Resources", title: "EB Governance & HR Lead", color: "#9b5de5" },
    { name: "Director Riasat Envoy", dept: "Public Relations", title: "EB Corporate Relations Director", color: "#00b4d8" },
    { name: "Director Nazmul Cloud", dept: "Research & Development", title: "EB Technology Director", color: "#00f5d4" }
  ],

  // Exactly 4 Governing Body (GB) Members (All 4 together in Level 4)
  governingBody: [
    {
      id: "gb_president",
      name: "GB President",
      title: "Supreme Club Commander",
      hp: 240,
      color: "#ff0055",
      pattern: "spread",
      fireRate: 1.7,
      bulletSpeed: 520
    },
    {
      id: "gb_vp",
      name: "GB Vice President",
      title: "Vice President Strategy",
      hp: 210,
      color: "#00d2ff",
      pattern: "dual_burst",
      fireRate: 1.5,
      bulletSpeed: 560
    },
    {
      id: "gb_gs",
      name: "GB General Secretary",
      title: "General Secretary Ops",
      hp: 190,
      color: "#a855f7",
      pattern: "bouncing_orb",
      fireRate: 1.9,
      bulletSpeed: 480
    },
    {
      id: "gb_treasurer",
      name: "GB Treasurer",
      title: "Treasurer Vaultmaster",
      hp: 180,
      color: "#eab308",
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

  // Level Progression Configuration
  levels: {
    1: {
      id: 1,
      title: "Level 1: GM to Executive",
      subtitle: "Classic Endless Runner Trials",
      targetDodges: 7, // Exactly 7 GMs total
      coinPerDodge: 1,
      speed: 310,
      playerRank: "GM",
      nextRank: "Executive",
      promotionMessage: "Congratulations, You have been promoted from GM to Executive!"
    },
    2: {
      id: 2,
      title: "Level 2: Executive to Senior Executive",
      subtitle: "7 BUCC Department Gauntlet & High-Velocity Fire",
      targetDodges: 14, // 14 Department encounters (Executives & Sr. Execs)
      coinPerDodge: 4,
      speed: 360,
      playerRank: "Executive",
      nextRank: "Senior Executive",
      promotionMessage: "Outstanding! You cleared all department trials and advanced to Senior Executive!"
    },
    3: {
      id: 3,
      title: "Level 3: Senior Executive to Executive Board (EB)",
      subtitle: "Stationary Arena Duel vs 3 Senior Executives",
      playerRank: "Senior Executive",
      nextRank: "Executive Board",
      promotionMessage: "Promoted to Executive Board (EB)!",
      enemies: [
        { name: "Sr. Exec Emon", title: "R&D Software Lead", hp: 130, fireRate: 1.6, speed: 460, color: "#00f5d4" },
        { name: "Sr. Exec Shakil", title: "Event Venue Maestro", hp: 145, fireRate: 1.4, speed: 480, color: "#2ec4b6" },
        { name: "Sr. Exec Arif", title: "C&M Strategy Veteran", hp: 160, fireRate: 1.3, speed: 500, color: "#ff9f1c" }
      ]
    },
    4: {
      id: 4,
      title: "Level 4: The Final Stand — EB to Governing Body (GB)",
      subtitle: "Apex Boss Battle: 4 Governing Body Members Simultaneously",
      playerRank: "Executive Board",
      nextRank: "Governing Body Leader",
      promotionMessage: "VICTORY! You defeated all 4 Governing Body Leaders and claimed BUCC Leadership!",
      bosses: [
        {
          id: "gb_president",
          name: "GB President",
          title: "Supreme Club Commander",
          hp: 240,
          color: "#ff0055",
          pattern: "spread",
          fireRate: 1.7,
          bulletSpeed: 520
        },
        {
          id: "gb_vp",
          name: "GB Vice President",
          title: "Vice President Strategy",
          hp: 210,
          color: "#00d2ff",
          pattern: "dual_burst",
          fireRate: 1.5,
          bulletSpeed: 560
        },
        {
          id: "gb_gs",
          name: "GB General Secretary",
          title: "General Secretary Ops",
          hp: 190,
          color: "#a855f7",
          pattern: "bouncing_orb",
          fireRate: 1.9,
          bulletSpeed: 480
        },
        {
          id: "gb_treasurer",
          name: "GB Treasurer",
          title: "Treasurer Vaultmaster",
          hp: 180,
          color: "#eab308",
          pattern: "cluster_barrage",
          fireRate: 2.0,
          bulletSpeed: 500
        }
      ]
    }
  }
};
