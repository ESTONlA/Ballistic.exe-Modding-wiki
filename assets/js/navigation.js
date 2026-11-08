// Page titles, order and navigation groups. Run npm run check after editing.
window.WIKI_PAGES = [
  [
    "introduction",
    "Introduction",
    "Getting started"
  ],
  [
    "installation",
    "Installing UE4SS",
    "Getting started"
  ],
  [
    "first-mod",
    "Your first mod",
    "Getting started"
  ],
  [
    "lua-basics",
    "Lua basics for modding",
    "Getting started"
  ],
  [
    "project-structure",
    "Organising a mod",
    "Getting started"
  ],
  [
    "changelog",
    "Changelog",
    "Getting started"
  ],
  [
    "hooks",
    "Working with hooks",
    "Lua scripting"
  ],
  [
    "objects",
    "Finding game objects",
    "Lua scripting"
  ],
  [
    "runtime",
    "Timers & cleanup",
    "Lua scripting"
  ],
  [
    "data-tables",
    "Reading data tables",
    "Lua scripting"
  ],
  [
    "debugging",
    "Debugging",
    "Lua scripting"
  ],
  [
    "performance",
    "Performance & profiling",
    "Lua scripting"
  ],
  [
    "settings-files",
    "Settings & local files",
    "Lua scripting"
  ],
  [
    "mod-conflicts",
    "Finding conflicts between mods",
    "Lua scripting"
  ],
  [
    "reflection",
    "Reflection, classes & instances",
    "Unreal fundamentals"
  ],
  [
    "unreal-types",
    "Names, text & soft references",
    "Unreal fundamentals"
  ],
  [
    "containers",
    "Arrays, sets & maps",
    "Unreal fundamentals"
  ],
  [
    "transforms",
    "Vectors, rotations & spaces",
    "Unreal fundamentals"
  ],
  [
    "player-world",
    "Worlds, players & controllers",
    "Unreal fundamentals"
  ],
  [
    "object-dumps",
    "Reading object dumps",
    "Unreal fundamentals"
  ],
  [
    "workshop-inspector",
    "Build a weapon inspector",
    "Walkthroughs"
  ],
  [
    "testing",
    "Test a mod step by step",
    "Walkthroughs"
  ],
  [
    "target-inspector",
    "Build a target inspector",
    "Walkthroughs"
  ],
  [
    "range-lab",
    "Plan a runtime range",
    "Walkthroughs"
  ],
  [
    "weapons",
    "Weapon assemblies",
    "Weapons"
  ],
  [
    "attachments",
    "Attachments & rails",
    "Weapons"
  ],
  [
    "weapon-stats",
    "Weapon stats",
    "Weapons"
  ],
  [
    "ballistics",
    "Shots & ballistics",
    "Weapons"
  ],
  [
    "ammunition",
    "Cartridges & projectiles",
    "Weapons"
  ],
  [
    "reloads",
    "Magazines & reloading",
    "Weapons"
  ],
  [
    "aim-recoil",
    "Aiming, cameras & recoil",
    "Weapons"
  ],
  [
    "weapon-serialization",
    "Weapon templates & round trips",
    "Weapons"
  ],
  [
    "weapon-failures",
    "Diagnosing weapon failures",
    "Weapon mechanics"
  ],
  [
    "firing-cycle",
    "Following the firing cycle",
    "Weapon mechanics"
  ],
  [
    "fire-modes",
    "Triggers, safeties & fire modes",
    "Weapon mechanics"
  ],
  [
    "barrel-heat",
    "Barrel heat & cooling",
    "Weapon mechanics"
  ],
  [
    "sight-zeroing",
    "Sight alignment & zeroing",
    "Weapon mechanics"
  ],
  [
    "scopes-optics",
    "Scopes, reticles & lens captures",
    "Weapon mechanics"
  ],
  [
    "laser-dots",
    "Laser dots & material parameters",
    "Weapon mechanics"
  ],
  [
    "wind-atmosphere",
    "Wind & atmospheric conditions",
    "Ballistics research"
  ],
  [
    "penetration-ricochet",
    "Energy, surfaces & impact behaviour",
    "Ballistics research"
  ],
  [
    "sound-diagnostics",
    "Tracing gunshot & impact sounds",
    "Ballistics research"
  ],
  [
    "targets",
    "Finding & tracking targets",
    "Ranges & targets"
  ],
  [
    "scoring",
    "Hits & scoring",
    "Ranges & targets"
  ],
  [
    "ranges",
    "Range menus & travel",
    "Ranges & targets"
  ],
  [
    "workshop-ui",
    "Workshop UI",
    "Menus & saves"
  ],
  [
    "progression",
    "Ownership & unlocks",
    "Menus & saves"
  ],
  [
    "saves",
    "Reading & backing up saves",
    "Menus & saves"
  ],
  [
    "target-bonuses",
    "Target bonuses & challenges",
    "Progression & interactions"
  ],
  [
    "objectives",
    "Weapon objectives & hit sequences",
    "Progression & interactions"
  ],
  [
    "quests-dialogue",
    "Quests, dialogue & rewards",
    "Progression & interactions"
  ],
  [
    "shop-categories",
    "Shop listings & purchase state",
    "Progression & interactions"
  ],
  [
    "save-schema",
    "Save fields & runtime mirrors",
    "Progression & interactions"
  ],
  [
    "spotter-tools",
    "Spotter cameras & range probes",
    "Progression & interactions"
  ],
  [
    "manipulation-actions",
    "Dragging, sliding & rotating parts",
    "Progression & interactions"
  ],
  [
    "input-focus",
    "Input, focus & cursors",
    "Input & UI"
  ],
  [
    "umg-layout",
    "UMG panels & layout",
    "Input & UI"
  ],
  [
    "hud-nameplates",
    "HUDs, markers & nameplates",
    "Input & UI"
  ],
  [
    "camera-modes",
    "Player cameras & view limits",
    "Input & UI"
  ],
  [
    "asset-loading",
    "Asset paths & loading",
    "Runtime content"
  ],
  [
    "spawning",
    "Spawning & actor ownership",
    "Runtime content"
  ],
  [
    "meshes-materials",
    "Meshes, materials & textures",
    "Runtime content"
  ],
  [
    "lighting",
    "Lighting & exposure diagnosis",
    "Runtime content"
  ],
  [
    "physics",
    "Collision & physics",
    "Runtime content"
  ],
  [
    "audio",
    "Weapon audio & spatial sound",
    "Runtime content"
  ],
  [
    "effects",
    "Muzzle flashes, tracers & impacts",
    "Runtime content"
  ],
  [
    "render-settings",
    "Graphics settings & visual diagnosis",
    "Runtime content"
  ],
  [
    "multiplayer",
    "Multiplayer architecture",
    "Networking"
  ],
  [
    "steam",
    "Steam sessions & invites",
    "Networking"
  ],
  [
    "network-protocol",
    "Messages & reliable events",
    "Networking"
  ],
  [
    "interpolation",
    "Movement interpolation",
    "Networking"
  ],
  [
    "clock-sync",
    "Clocks, latency & round timing",
    "Networking"
  ],
  [
    "chat",
    "Chat, names & text validation",
    "Networking"
  ],
  [
    "paths",
    "Game paths & classes",
    "Reference"
  ],
  [
    "custom-content",
    "Custom content",
    "Reference"
  ],
  [
    "packaging",
    "Packaging a Lua mod",
    "Reference"
  ],
  [
    "compatibility",
    "Checking game updates",
    "Reference"
  ],
  [
    "coverage",
    "Coverage & testing notes",
    "Reference"
  ],
  [
    "tools",
    "Tools & resources",
    "Reference"
  ],
  [
    "hook-reference",
    "Game hook reference",
    "Reference"
  ],
  [
    "glossary",
    "Modding glossary",
    "Reference"
  ],
  [
    "faq",
    "Troubleshooting FAQ",
    "Reference"
  ],
  [
    "schema-updates",
    "Tracking schema changes",
    "Reference"
  ],
  [
    "api-overview",
    "Game API index",
    "Game API reference"
  ],
  [
    "api-native-weapons",
    "Native weapon API",
    "Game API reference"
  ],
  [
    "api-native-world",
    "Native world & player API",
    "Game API reference"
  ],
  [
    "api-weapon-classes",
    "Weapon Blueprint API",
    "Game API reference"
  ],
  [
    "api-attachment-classes",
    "Attachment Blueprint API",
    "Game API reference"
  ],
  [
    "api-ammunition-classes",
    "Ammunition Blueprint API",
    "Game API reference"
  ],
  [
    "api-target-classes",
    "Target Blueprint API",
    "Game API reference"
  ],
  [
    "api-game-classes",
    "Game instance & save API",
    "Game API reference"
  ],
  [
    "api-player-classes",
    "Player & camera Blueprint API",
    "Game API reference"
  ],
  [
    "api-manipulation-classes",
    "Manipulation Blueprint API",
    "Game API reference"
  ],
  [
    "api-spotter-classes",
    "Spotter Blueprint API",
    "Game API reference"
  ],
  [
    "api-bunker-classes",
    "Bunker interaction API",
    "Game API reference"
  ],
  [
    "api-quest-classes",
    "Quest Blueprint API",
    "Game API reference"
  ],
  [
    "api-workshop-ui",
    "Workshop widget API",
    "Game API reference"
  ],
  [
    "api-menu-ui",
    "Menu & prompt widget API",
    "Game API reference"
  ],
  [
    "api-hud-ui",
    "HUD & ammo widget API",
    "Game API reference"
  ],
  [
    "api-common-ui",
    "Common controls & instruments API",
    "Game API reference"
  ],
  [
    "api-debug-ui",
    "Debug widget API",
    "Game API reference"
  ],
  [
    "api-other-classes",
    "Components, libraries & other API",
    "Game API reference"
  ],
  [
    "api-structs",
    "Game struct field reference",
    "Game API reference"
  ],
  [
    "api-enums",
    "Game enum value reference",
    "Game API reference"
  ]
];
