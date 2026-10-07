<?php
/**
 * BUCC Promotion Game - Master Configuration
 * BRAC University Computer Club Member Hierarchy & Game Balance Settings
 */

if (!defined('BUCC_GAME_APP')) {
    define('BUCC_GAME_APP', true);
}

return [
    'game_title' => 'BUCC Dino Runner & Boss Shooter',
    'club_name' => 'BRAC UNIVERSITY COMPUTER CLUB',
    'version' => '1.3.0',

    // Ranks hierarchy
    'ranks' => [
        'GM' => [
            'name' => 'General Member',
            'short' => 'GM',
            'badge_color' => '#00b4d8',
            'description' => 'Newly recruited general member of BUCC.'
        ],
        'EXECUTIVE' => [
            'name' => 'Executive',
            'short' => 'Executive',
            'badge_color' => '#ff9f1c',
            'description' => 'Departmental Executive driving active club initiatives.'
        ],
        'SENIOR_EXECUTIVE' => [
            'name' => 'Senior Executive',
            'short' => 'Sr. Executive',
            'badge_color' => '#9b5de5',
            'description' => 'Senior department leader mentoring upcoming executives.'
        ],
        'EXECUTIVE_BOARD' => [
            'name' => 'Executive Board',
            'short' => 'EB',
            'badge_color' => '#e056fd',
            'description' => 'High-ranking club strategist and event orchestrator.'
        ],
        'GOVERNING_BODY' => [
            'name' => 'Governing Body',
            'short' => 'GB',
            'badge_color' => '#ffd166',
            'description' => 'Apex club leadership steering the entire organization.'
        ]
    ],

    // Exactly 7 General Members (Level 1)
    'gm_members' => [
        ['name' => 'GM Tanvir Rookie', 'title' => 'Freshman Member'],
        ['name' => 'GM Sadia Python', 'title' => 'Code Apprentice'],
        ['name' => 'GM Rayan Hardware', 'title' => 'Lab Trainee'],
        ['name' => 'GM Lamia Algorist', 'title' => 'Problem Solver'],
        ['name' => 'GM Faisal Frontend', 'title' => 'Web Novice'],
        ['name' => 'GM Tasnim Git', 'title' => 'Version Control Trainee'],
        ['name' => 'GM Nafis Creative', 'title' => 'Junior Designer']
    ],

    // 7 BUCC Departments
    // Exactly 2 Executives per department = 14 Executives Total
    // Exactly 2 Senior Executives per department = 14 Senior Executives Total
    'departments' => [
        'creative' => [
            'id' => 'creative',
            'name' => 'Creative',
            'theme_color' => '#ff2a85',
            'accent_color' => '#ff70a6',
            'executives' => [
                ['name' => 'Abrar Design', 'title' => 'Visual Director', 'rank' => 'Executive'],
                ['name' => 'Farzana Canvas', 'title' => 'Illustrator Exec', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Tanha Aesthetics', 'title' => 'Sr. Exec Visual Arts', 'rank' => 'Senior Executive'],
                ['name' => 'Fahim Layout', 'title' => 'Sr. Exec Publications', 'rank' => 'Senior Executive']
            ]
        ],
        'cm' => [
            'id' => 'cm',
            'name' => 'Communication & Marketing',
            'theme_color' => '#ff9f1c',
            'accent_color' => '#ffbf69',
            'executives' => [
                ['name' => 'Tahmid Outreach', 'title' => 'C&M Lead Exec', 'rank' => 'Executive'],
                ['name' => 'Sarah Campaign', 'title' => 'Content Strategist', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Arif Engage', 'title' => 'Sr. Exec Communications', 'rank' => 'Senior Executive'],
                ['name' => 'Tasnia Promo', 'title' => 'Sr. Exec Brand Outreach', 'rank' => 'Senior Executive']
            ]
        ],
        'em' => [
            'id' => 'em',
            'name' => 'Event Management',
            'theme_color' => '#2ec4b6',
            'accent_color' => '#cbf3f0',
            'executives' => [
                ['name' => 'Tanvir Logistics', 'title' => 'Venue Coordinator', 'rank' => 'Executive'],
                ['name' => 'Sadia Stage', 'title' => 'Protocol Officer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Shakil Decor', 'title' => 'Sr. Exec Stage & Venue', 'rank' => 'Senior Executive'],
                ['name' => 'Ishraq Planner', 'title' => 'Sr. Exec Event Logistics', 'rank' => 'Senior Executive']
            ]
        ],
        'finance' => [
            'id' => 'finance',
            'name' => 'Finance',
            'theme_color' => '#ffd166',
            'accent_color' => '#ffe494',
            'executives' => [
                ['name' => 'Shakil Ledger', 'title' => 'Budget Master', 'rank' => 'Executive'],
                ['name' => 'Nafisa Audit', 'title' => 'Treasury Officer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Faisal Fiscal', 'title' => 'Sr. Exec Treasury', 'rank' => 'Senior Executive'],
                ['name' => 'Samira Audit', 'title' => 'Sr. Exec Financial Compliance', 'rank' => 'Senior Executive']
            ]
        ],
        'hr' => [
            'id' => 'hr',
            'name' => 'Human Resources',
            'theme_color' => '#9b5de5',
            'accent_color' => '#b388ff',
            'executives' => [
                ['name' => 'Tasnim Recruiter', 'title' => 'Talent Acquisition', 'rank' => 'Executive'],
                ['name' => 'Arif Personnel', 'title' => 'Member Relations', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Nayeem Talent', 'title' => 'Sr. Exec HR Operations', 'rank' => 'Senior Executive'],
                ['name' => 'Sabrina Mentor', 'title' => 'Sr. Exec Member Development', 'rank' => 'Senior Executive']
            ]
        ],
        'pr' => [
            'id' => 'pr',
            'name' => 'Public Relations',
            'theme_color' => '#00b4d8',
            'accent_color' => '#90e0ef',
            'executives' => [
                ['name' => 'Rafid Diplomat', 'title' => 'Club Spokesperson', 'rank' => 'Executive'],
                ['name' => 'Samira Press', 'title' => 'External Liaison', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Arham Emissary', 'title' => 'Sr. Exec External Relations', 'rank' => 'Senior Executive'],
                ['name' => 'Shreya Press', 'title' => 'Sr. Exec Media Relations', 'rank' => 'Senior Executive']
            ]
        ],
        'rnd' => [
            'id' => 'rnd',
            'name' => 'Research & Development',
            'theme_color' => '#00f5d4',
            'accent_color' => '#7bf1a8',
            'executives' => [
                ['name' => 'Adittya Dev', 'title' => 'Core Systems Architect', 'rank' => 'Executive'],
                ['name' => 'Mahir Kernel', 'title' => 'Full-Stack Specialist', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Emon Backend', 'title' => 'Sr. Exec Software Engineering', 'rank' => 'Senior Executive'],
                ['name' => 'Towhid Frontend', 'title' => 'Sr. Exec Web Technologies', 'rank' => 'Senior Executive']
            ]
        ]
    ],

    // Exactly 7 Executive Board (EB) Members (1 from each department)
    'executive_board_members' => [
        ['name' => 'Director Sabrina Chroma', 'dept' => 'Creative', 'title' => 'EB Creative Director', 'color' => '#ff2a85'],
        ['name' => 'Director Rayhan Growth', 'dept' => 'C&M', 'title' => 'EB Strategic Marketing Lead', 'color' => '#ff9f1c'],
        ['name' => 'Director Tanjim Protocol', 'dept' => 'Event Management', 'title' => 'EB Event Operations Lead', 'color' => '#2ec4b6'],
        ['name' => 'Director Rehan Forecast', 'dept' => 'Finance', 'title' => 'EB Treasury Director', 'color' => '#ffd166'],
        ['name' => 'Director Tariq Ethics', 'dept' => 'Human Resources', 'title' => 'EB Governance & HR Lead', 'color' => '#9b5de5'],
        ['name' => 'Director Riasat Envoy', 'dept' => 'Public Relations', 'title' => 'EB Corporate Relations Director', 'color' => '#00b4d8'],
        ['name' => 'Director Nazmul Cloud', 'dept' => 'Research & Development', 'title' => 'EB Technology Director', 'color' => '#00f5d4']
    ],

    // Exactly 4 Governing Body (GB) Members (All 4 together in Level 4)
    'governing_body' => [
        [
            'id' => 'gb_president',
            'name' => 'GB President',
            'title' => 'Supreme Club Commander',
            'hp' => 240,
            'attack_pattern' => 'spread',
            'color' => '#ff0055',
            'projectile_speed' => 520,
            'fire_rate' => 1.7
        ],
        [
            'id' => 'gb_vp',
            'name' => 'GB Vice President',
            'title' => 'Vice President Strategy',
            'hp' => 210,
            'attack_pattern' => 'dual_burst',
            'color' => '#00d2ff',
            'projectile_speed' => 560,
            'fire_rate' => 1.5
        ],
        [
            'id' => 'gb_gs',
            'name' => 'GB General Secretary',
            'title' => 'General Secretary Ops',
            'hp' => 190,
            'attack_pattern' => 'bouncing_orb',
            'color' => '#a855f7',
            'projectile_speed' => 480,
            'fire_rate' => 1.9
        ],
        [
            'id' => 'gb_treasurer',
            'name' => 'GB Treasurer',
            'title' => 'Treasurer Vaultmaster',
            'hp' => 180,
            'attack_pattern' => 'cluster_barrage',
            'color' => '#eab308',
            'projectile_speed' => 500,
            'fire_rate' => 2.0
        ]
    ],

    // Weapons Configuration (Shop lowest price is 50 coins)
    'weapons' => [
        'pistol' => [
            'id' => 'pistol',
            'name' => 'Standard Pistol',
            'cost' => 0,
            'damage' => 16,
            'cooldown' => 0.5,
            'projectile_speed' => 720,
            'bullet_color' => '#00f0ff',
            'bullet_size' => 4,
            'description' => 'Issued to rising club members. Reliable base damage with 0.5s cooldown.'
        ],
        'blaster' => [
            'id' => 'blaster',
            'name' => 'Rapid Blaster',
            'cost' => 50, // Lowest shop price is 50 coins as requested
            'damage' => 26,
            'cooldown' => 0.35,
            'projectile_speed' => 950,
            'bullet_color' => '#ff007f',
            'bullet_size' => 5,
            'description' => 'High-velocity plasma blaster. Accelerated cycle time & rapid fire suppression.'
        ],
        'cannon' => [
            'id' => 'cannon',
            'name' => 'Heavy Cannon',
            'cost' => 90, // Heavy upgraded cannon
            'damage' => 60,
            'cooldown' => 0.5,
            'projectile_speed' => 680,
            'bullet_color' => '#ffd166',
            'bullet_size' => 8,
            'description' => 'Overcharged electromagnetic cannon. Massive impact damage per plasma shell.'
        ]
    ],

    // Level progression parameters
    'levels' => [
        1 => [
            'name' => 'GM to Executive',
            'type' => 'runner',
            'target_dodges' => 7, // Exactly 7 GMs total
            'coin_reward_per_dodge' => 1,
            'player_rank' => 'GM',
            'promotion_rank' => 'Executive',
            'promotion_message' => 'Congratulations, You have been promoted from GM to Executive!'
        ],
        2 => [
            'name' => 'Executive to Senior Executive',
            'type' => 'runner_shooter_dodge',
            'total_departments' => 7,
            'target_dodges' => 14, // 14 Department encounters (Executives & Sr. Execs)
            'coin_reward_per_dodge' => 4,
            'player_rank' => 'Executive',
            'promotion_rank' => 'Senior Executive',
            'promotion_message' => 'Outstanding! You cleared all department trials and advanced to Senior Executive!'
        ],
        3 => [
            'name' => 'Senior Executive to EB',
            'type' => 'arena_shooter',
            'enemy_count' => 3,
            'player_rank' => 'Senior Executive',
            'promotion_rank' => 'Executive Board (EB)',
            'promotion_message' => 'Promoted to Executive Board (EB)!'
        ],
        4 => [
            'name' => 'EB to Governing Body (Final Stand)',
            'type' => 'boss_battle',
            'boss_count' => 4, // 4 GBs all together
            'player_rank' => 'Executive Board',
            'promotion_rank' => 'Governing Body Leader',
            'promotion_message' => 'VICTORY! You defeated all 4 Governing Body Leaders and claimed BUCC Leadership!'
        ]
    ]
];
