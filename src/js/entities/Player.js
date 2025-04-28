import { PLAYER_SPEED, PLAYER_WIDTH, PLAYER_HEIGHT, mapWidth, mapHeight } from '../config/constants.js';
import { add, sprite, pos, destroy } from '../context.js';

const PIXELS_PER_MILE = 960; // 1 mile = 960 pixels
const VIBE_MILE_INCREMENT = 0.5; // 1 vibe per 0.5 miles
const MESSAGE_COLOR = [0, 0, 139]; // Dark blue

export class Player {
    constructor(gameState) {
        this.gameState = gameState;
        this.sprite = null;
        this.lastPos = null;
        this.totalDistance = 0;
        this.milesSinceLastVibe = 0;
    }

    spawn() {
        this.sprite = add([
            sprite("player", { width: 50, height: 50 }),
            pos(center()),
            area(),
            "player",
            z(1)
        ]);
        this.lastPos = this.sprite.pos.clone();
        return this.sprite;
    }

    update() {
        if (!this.sprite || !this.lastPos) return;

        // Calculate distance moved since last update
        const dx = this.sprite.pos.x - this.lastPos.x;
        const dy = this.sprite.pos.y - this.lastPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Add to total distance
        this.totalDistance += distance;
        
        // Update last position
        this.lastPos = this.sprite.pos.clone();

        // Award 1 vibe for every 0.5 miles (480 pixels)
        const milesWalked = this.totalDistance / PIXELS_PER_MILE;
        if (milesWalked - this.milesSinceLastVibe >= VIBE_MILE_INCREMENT) {
            const vibesToAdd = Math.floor((milesWalked - this.milesSinceLastVibe) / VIBE_MILE_INCREMENT);
            this.gameState.vibes += vibesToAdd;
            this.milesSinceLastVibe += vibesToAdd * VIBE_MILE_INCREMENT;
        }
    }

    showMessage(message) {
        if (this.sprite) {
            const textObj = add([
                text(message, { size: 24 }),
                pos(this.sprite.pos.x, this.sprite.pos.y - 20),
                color(MESSAGE_COLOR[0], MESSAGE_COLOR[1], MESSAGE_COLOR[2]),
                fixed(),
                z(100),
                lifespan(2),
            ]);
        }
    }

    getDistanceWalked() {
        return this.totalDistance / PIXELS_PER_MILE;  // Convert pixels to miles
    }

    reset() {
        this.totalDistance = 0;
        this.milesSinceLastVibe = 0;
        if (this.sprite) {
            destroy(this.sprite);
            this.sprite = null;
        }
    }
} 