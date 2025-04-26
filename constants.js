// Game dimensions
const mapWidth = 2400;
const mapHeight = 1800;

// Game state constants
const INITIAL_VIBES = 10;
const WIN_VIBES = 50;
const LOSE_VIBES = 0;

// Time-based constants
const SUN_DURATION = 10; // seconds
const EDIBLE_DURATION = 5; // seconds
const DEVIL_WARNING_DURATION = 3; // seconds
const DEVIL_MIN_INTERVAL = 30; // seconds (increased from 10)
const DEVIL_LIFESPAN = 10; // seconds
const DEVIL_SPAWN_CHANCE = 0.15; // reduced from 0.25
const DEVIL_VIBES_PENALTY = 15;
const GRENADE_SPAWN_DELAY = 15; // seconds
const DOG_POOP_TIMER = 5; // seconds
const ITEM_SPAWN_INTERVAL_MIN = 0.5; // seconds
const ITEM_SPAWN_INTERVAL_MAX = 2; // seconds

// Map constants
const BLOCK_SIZE_NS = 1/20; // North-South blocks are 1/20th mile
const BLOCK_SIZE_EW = 1/5;  // East-West blocks are 1/5th mile

// UI constants
const UI_FONT_SIZE = 16;
const UI_COLOR = [30, 30, 30, 200]; // Dark semi-transparent
const UI_BG_COLOR = [255, 255, 255, 150]; // Light semi-transparent
const UI_PADDING = 4;

// Speed constants
const DEVIL_SPEED = 270; // Reduced by 10% from 300

// Visual constants
const SUN_COLOR = [255, 255, 180, 100]; // Yellow tint with alpha
const EDIBLE_COLORS = [
    [255, 100, 100, 90], // Red tint
    [100, 255, 100, 90], // Green tint
    [100, 100, 255, 90], // Blue tint
    [255, 100, 255, 90], // Purple tint
]; 