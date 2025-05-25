// src/js/entities/Player.js

import {
    add, sprite, area, body, move, destroy, pos, scale, z, play, width, height, center, text, color, fixed, lifespan
} from "../context.js";
import { PLAYER_SPEED, PLAYER_WIDTH, PLAYER_HEIGHT, mapWidth, mapHeight } from "../config/constants.js";
import { context } from "../context.js";  // For player reference

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
            sprite("player", { width: PLAYER_WIDTH, height: PLAYER_HEIGHT }),
            pos(center()),
            area(),
            "player",
            z(1),
        ]);
        this.lastPos = this.sprite.pos.clone();

        // Optional: register in shared context
        context.player = this.sprite;

        return this.sprite;
    }

    update() {
        if (!this.sprite || !this.lastPos) return;

        const dx = this.sprite.pos.x - this.lastPos.x;
        const dy = this.sprite.pos.y - this.lastPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.totalDistance += distance;
        this.lastPos = this.sprite.pos.clone();

        const milesWalked = this.totalDistance / PIXELS_PER_MILE;
        if (milesWalked - this.milesSinceLastVibe >= VIBE_MILE_INCREMENT) {
            const vibesToAdd = Math.floor((milesWalked - this.milesSinceLastVibe) / VIBE_MILE_INCREMENT);
            this.gameState.vibes += vibesToAdd;
            this.milesSinceLastVibe += vibesToAdd * VIBE_MILE_INCREMENT;
        }
    }

    showMessage(message) {
        if (this.sprite) {
            add([
                text(message, { size: 24 }),
                pos(this.sprite.pos.x, this.sprite.pos.y - 20),
                color(...MESSAGE_COLOR),
                fixed(),
                z(100),
                lifespan(2),
            ]);
        }
    }

    getDistanceWalked() {
        return this.totalDistance / PIXELS_PER_MILE;
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
