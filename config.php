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

    // Exactly 7 General Members (Level 1) - One per department consecutively
    'gm_members' => [
        ['name' => 'C&M Member', 'dept_name' => 'C&M', 'color' => '#ff9f1c', 'title' => 'General Member'],
        ['name' => 'Creative Member', 'dept_name' => 'Creative', 'color' => '#ff2a85', 'title' => 'General Member'],
        ['name' => 'Event Mgmt Member', 'dept_name' => 'Event Management', 'color' => '#2ec4b6', 'title' => 'General Member'],
        ['name' => 'Finance Member', 'dept_name' => 'Finance', 'color' => '#ffd166', 'title' => 'General Member'],
        ['name' => 'PR Member', 'dept_name' => 'PR', 'color' => '#00b4d8', 'title' => 'General Member'],
        ['name' => 'HR Member', 'dept_name' => 'HR', 'color' => '#9b5de5', 'title' => 'General Member'],
        ['name' => 'R&D Member', 'dept_name' => 'R&D', 'color' => '#00f5d4', 'title' => 'General Member']
    ],

    // 7 BUCC Departments in user-specified consecutive order:
    // C&M, Creative, Event Management, Finance, PR, HR, R&D
    'departments' => [
        'cm' => [
            'id' => 'cm',
            'name' => 'C&M',
            'full_name' => 'Communication & Marketing (C&M)',
            'theme_color' => '#ff9f1c',
            'accent_color' => '#ffbf69',
            'executives' => [
                ['name' => 'Tahmid', 'title' => 'Officer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Md. Ishtiaq Mozumder', 'title' => 'Sr. Exec C&M', 'rank' => 'Senior Executive', 'hp' => 60],
                ['name' => 'S.M.Abrar Shaleheen', 'title' => 'Sr. Exec C&M', 'rank' => 'Senior Executive', 'hp' => 60]
            ]
        ],
        'creative' => [
            'id' => 'creative',
            'name' => 'Creative',
            'full_name' => 'Creative',
            'theme_color' => '#ff2a85',
            'accent_color' => '#ff70a6',
            'executives' => [
                ['name' => 'Abrar', 'title' => 'Visual Designer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'MD. Mushfiqur Rahman', 'title' => 'Sr. Exec Creative', 'rank' => 'Senior Executive', 'hp' => 60],
                ['name' => 'Mahajabin Islam', 'title' => 'Sr. Exec Creative', 'rank' => 'Senior Executive', 'hp' => 60]
            ]
        ],
        'em' => [
            'id' => 'em',
            'name' => 'Event Management',
            'full_name' => 'Event Management',
            'theme_color' => '#2ec4b6',
            'accent_color' => '#cbf3f0',
            'executives' => [
                ['name' => 'Tanvir', 'title' => 'Logistics Officer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Fahim Faysal', 'title' => 'Sr. Exec Event Mgmt', 'rank' => 'Senior Executive', 'hp' => 60],
                ['name' => 'Fahim Al Razy', 'title' => 'Sr. Exec Event Mgmt', 'rank' => 'Senior Executive', 'hp' => 60]
            ]
        ],
        'finance' => [
            'id' => 'finance',
            'name' => 'Finance',
            'full_name' => 'Finance',
            'theme_color' => '#ffd166',
            'accent_color' => '#ffe494',
            'executives' => [
                ['name' => 'Shakil', 'title' => 'Treasury Officer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Arnab', 'title' => 'Sr. Exec Finance', 'rank' => 'Senior Executive', 'hp' => 60],
                ['name' => 'Raisa', 'title' => 'Sr. Exec Finance', 'rank' => 'Senior Executive', 'hp' => 60]
            ]
        ],
        'pr' => [
            'id' => 'pr',
            'name' => 'PR',
            'full_name' => 'Public Relations (PR)',
            'theme_color' => '#00b4d8',
            'accent_color' => '#90e0ef',
            'executives' => [
                ['name' => 'Rafid', 'title' => 'Liaison Officer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Tanisha', 'title' => 'Sr. Exec PR', 'rank' => 'Senior Executive', 'hp' => 60],
                ['name' => 'Shovon Pr', 'title' => 'Sr. Exec PR', 'rank' => 'Senior Executive', 'hp' => 60]
            ]
        ],
        'hr' => [
            'id' => 'hr',
            'name' => 'HR',
            'full_name' => 'Human Resources (HR)',
            'theme_color' => '#9b5de5',
            'accent_color' => '#b388ff',
            'executives' => [
                ['name' => 'Tasnim', 'title' => 'Talent Officer', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Adittya', 'title' => 'Sr. Exec HR', 'rank' => 'Senior Executive', 'hp' => 130, 'scale' => 1.35],
                ['name' => 'Subrajit', 'title' => 'Sr. Exec HR', 'rank' => 'Senior Executive', 'hp' => 130, 'scale' => 1.35]
            ]
        ],
        'rnd' => [
            'id' => 'rnd',
            'name' => 'R&D',
            'full_name' => 'Research & Development (R&D)',
            'theme_color' => '#00f5d4',
            'accent_color' => '#7bf1a8',
            'executives' => [
                ['name' => 'Dev', 'title' => 'Tech Specialist', 'rank' => 'Executive']
            ],
            'senior_executives' => [
                ['name' => 'Mahir Dyan', 'title' => 'Sr. Exec R&D', 'rank' => 'Senior Executive', 'hp' => 60],
                ['name' => 'Siam Ferdous', 'title' => 'Sr. Exec R&D', 'rank' => 'Senior Executive', 'hp' => 60]
            ]
        ]
    ],

    // Exactly 7 Executive Board (EB) Members (1 from each department as listed by user)
    'executive_board_members' => [
        ['name' => 'Zawad Bhai', 'dept' => 'C&M', 'title' => 'EB C&M Director', 'color' => '#ff9f1c', 'fire_rate' => 1.1, 'bullet_speed' => 750],
        ['name' => 'Luban Bhai', 'dept' => 'Creative', 'title' => 'EB Creative Director', 'color' => '#ff2a85', 'fire_rate' => 1.1, 'bullet_speed' => 750],
        ['name' => 'Rafi Bhai', 'dept' => 'Event Management', 'title' => 'EB Event Operations Director', 'color' => '#2ec4b6', 'fire_rate' => 1.1, 'bullet_speed' => 750],
        ['name' => 'Rawnak Bhai', 'dept' => 'Finance', 'title' => 'EB Treasury Director', 'color' => '#ffd166', 'fire_rate' => 1.1, 'bullet_speed' => 750],
        ['name' => 'Kabya Apu', 'dept' => 'HR', 'title' => 'EB Governance & HR Director', 'color' => '#ff5722', 'hp' => 140, 'fire_rate' => 1.0, 'bullet_speed' => 720, 'has_fire_gun' => true, 'scale' => 1.35],
        ['name' => 'Anika Apu', 'dept' => 'PR', 'title' => 'EB PR Director', 'color' => '#00b4d8', 'fire_rate' => 1.1, 'bullet_speed' => 750],
        ['name' => 'Abir Bhai', 'dept' => 'R&D', 'title' => 'EB Technology Director', 'color' => '#00f5d4', 'fire_rate' => 1.0, 'bullet_speed' => 780]
    ],

    // Exactly 4 Governing Body (GB) Members (All 4 together in the last level)
    'governing_body' => [
        [
            'id' => 'gb_president',
            'name' => 'Jauad Ahmed Sadik',
            'title' => 'President',
            'hp' => 240,
            'attack_pattern' => 'spread',
            'color' => '#ff0055',
            'projectile_speed' => 520,
            'fire_rate' => 1.7
        ],
        [
            'id' => 'gb_vp',
            'name' => 'Shudeepta Roy Mou',
            'title' => 'Vice President',
            'hp' => 210,
            'attack_pattern' => 'dual_burst',
            'color' => '#00d2ff',
            'projectile_speed' => 560,
            'fire_rate' => 1.5
        ],
        [
            'id' => 'gb_gs',
            'name' => 'G M JUBAYER ZAMAN',
            'title' => 'General Secretary',
            'hp' => 190,
            'attack_pattern' => 'bouncing_orb',
            'color' => '#a855f7',
            'projectile_speed' => 480,
            'fire_rate' => 1.9
        ],
        [
            'id' => 'gb_treasurer',
            'name' => 'Syed Adnan Rahman',
            'title' => 'Treasurer',
            'hp' => 180,
            'attack_pattern' => 'cluster_barrage',
            'color' => '#ffd166',
            'projectile_speed' => 500,
            'fire_rate' => 2.0
        ]
    ],

    // Weapons Configuration
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
            'cost' => 50,
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
            'cost' => 90,
            'damage' => 60,
            'cooldown' => 0.5,
            'projectile_speed' => 680,
            'bullet_color' => '#ffd166',
            'bullet_size' => 8,
            'description' => 'Overcharged electromagnetic cannon. Massive impact damage per plasma shell.'
        ]
    ],

    // Level progression parameters (5 Levels)
    'levels' => [
        1 => [
            'name' => 'GM to Executive',
            'type' => 'runner',
            'announcement' => 'General Members are coming',
            'target_dodges' => 7,
            'coin_reward_per_dodge' => 1,
            'player_rank' => 'GM',
            'promotion_rank' => 'Executive',
            'promotion_message' => 'Congratulations, You have been promoted from GM to Executive!'
        ],
        2 => [
            'name' => 'Executive to Senior Executive',
            'type' => 'runner_shooter_dodge',
            'announcement' => 'Executives are coming',
            'total_departments' => 7,
            'target_dodges' => 7,
            'coin_reward_per_dodge' => 4,
            'player_rank' => 'Executive',
            'promotion_rank' => 'Senior Executive',
            'promotion_message' => 'Outstanding! You cleared all department trials and advanced to Senior Executive!'
        ],
        3 => [
            'name' => 'Senior Executive to EB',
            'type' => 'arena_shooter',
            'announcement' => 'Senior executives are coming',
            'enemy_count' => 14,
            'player_rank' => 'Senior Executive',
            'promotion_rank' => 'Executive Board (EB)',
            'promotion_message' => 'Promoted to Executive Board (EB)!'
        ],
        4 => [
            'name' => 'Executive Board Trial',
            'type' => 'arena_shooter',
            'announcement' => 'Executive Board Members are coming',
            'enemy_count' => 7,
            'player_rank' => 'Executive Board',
            'promotion_rank' => 'Governing Body Contender',
            'promotion_message' => 'Outstanding! You conquered the Executive Board! Qualified for Governing Body Trials!'
        ],
        5 => [
            'name' => 'The Final Stand — Governing Body',
            'type' => 'boss_battle',
            'announcement' => 'Governing Body Members are coming',
            'boss_count' => 4,
            'player_rank' => 'Executive Board',
            'promotion_rank' => 'Governing Body Leader',
            'promotion_message' => 'VICTORY! You defeated all 4 Governing Body Leaders and claimed BUCC Leadership!'
        ]
    ]
];
