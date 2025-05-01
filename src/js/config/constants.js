// Game dimensions
export const mapWidth = 2400;
export const mapHeight = 1800;

// Player constants
export const PLAYER_SPEED = 200;
export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 50;

// Item constants
export const ITEM_WIDTH = 40;
export const ITEM_HEIGHT = 40;

// Game state constants
export const INITIAL_VIBES = 10;
export const WIN_VIBES = 50;
export const LOSE_VIBES = 0;

// Time-based constants (all in seconds)
export const SUN_DURATION = 10;        // Duration of sun effect
export const EDIBLE_DURATION = 5;      // Duration of edible effect
export const DEVIL_MIN_INTERVAL = 10;   // Minimum time between devil spawns
export const DEVIL_LIFESPAN = 15;       // How long devil stays before disappearing
export const DEVIL_SPAWN_CHANCE = 0.5;  // Chance of devil spawning
export const DEVIL_VIBES_PENALTY = 15;  // Vibes lost when caught by devil
export const DEVIL_INITIAL_DELAY = 10;  // Time before first devil spawn
export const GRENADE_FIRST_SPAWN_DELAY = 15;  // Time before grenade can first spawn
export const DOG_POOP_TIMER = 5;        // Time between dog poops
export const ITEM_SPAWN_INTERVAL_MIN = 0.5; // Minimum time between item spawns
export const ITEM_SPAWN_INTERVAL_MAX = 2;   // Maximum time between item spawns

// UI constants
export const UI_HEIGHT = 100;      // Height of UI header
export const UI_FONT_SIZE = 32;    // Font size for UI text
export const UI_TEXT_COLOR = [0, 0, 139]; // Dark blue for text
export const UI_BG_COLOR = [255, 255, 255]; // White background

// Speed constants
export const DEVIL_SPEED = 150;    // Devil movement speed

// Visual effect constants
export const SUN_COLOR = [255, 255, 180]; // Yellow tint for sun effect
export const EDIBLE_COLORS = [            // Colors for edible effect
    [255, 100, 100], // Red tint
    [100, 255, 100], // Green tint
    [100, 100, 255], // Blue tint
    [255, 100, 255], // Purple tint
]; 