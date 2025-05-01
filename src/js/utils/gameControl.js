// src/js/utils/gameControl.js

import {
    play, time
} from "../context.js";
import {
    INITIAL_VIBES, WIN_VIBES, LOSE_VIBES, EDIBLE_DURATION, SUN_DURATION, DEVIL_MIN_INTERVAL
} from "../config/constants.js";

export class Gamestate {
    constructor() {
        this.reset();
    }

    reset() {
        this.vibes = INITIAL_VIBES;
        this.inventory = [];
        this.sunActive = false;
        this.sunTimer = 0;
        this.edibleTimers = [];
        this.devil = null;
        this.devilDisabled = false;
        this.lastDevilSpawn = 0;
        this.devilSpawnedAt = 0;
        this.gameOver = false;
        this.resultText = "";
        this.devilMusic = null;
        this.sunEffectStartTime = 0;
        this.sunEffectActive = false;
        this.edibleEffectStartTime = 0;
        this.edibleEffectActive = false;
        this.lastDevilDestroyed = 0;
        this.sunDoublePoints = false;
    }

    isHigh() {
        const now = time();
        this.edibleTimers = this.edibleTimers.filter(t => now - t < EDIBLE_DURATION);
        return this.edibleTimers.length > 0;
    }

    applyEdible() {
        this.edibleTimers.push(time());
    }

    updateSunEffect() {
        if (this.sunEffectActive && time() - this.sunEffectStartTime > SUN_DURATION) {
            this.sunEffectActive = false;
            this.sunDoublePoints = false;
        }
        if (this.edibleEffectActive && time() - this.edibleEffectStartTime > EDIBLE_DURATION) {
            this.edibleEffectActive = false;
        }
    }

    activateSunEffect() {
        this.sunEffectActive = true;
        this.sunEffectStartTime = time();
        this.sunDoublePoints = true;
    }

    activateEdibleEffect() {
        this.edibleEffectActive = true;
        this.edibleEffectStartTime = time();
    }

    checkGameOver() {
        if (this.vibes >= WIN_VIBES) {
            this.gameOver = true;
            this.resultText = "win";
            return { gameOver: true, result: "win", vibes: this.vibes };
        } else if (this.vibes <= LOSE_VIBES) {
            this.gameOver = true;
            this.resultText = "lose";
            return { gameOver: true, result: "lose", vibes: this.vibes };
        }
        return { gameOver: false };
    }

    addToInventory(item) {
        if (!this.inventory.includes(item)) {
            this.inventory.push(item);
            return true;
        }
        return false;
    }

    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index !== -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }

    canSpawnDevil() {
        const now = time();
        return !this.devil &&
               !this.devilDisabled &&
               now - this.lastDevilSpawn > DEVIL_MIN_INTERVAL;
    }
}

// --- Sound control helpers ---

export function playBackgroundMusic() {
    play("background", { loop: true });
}

export function playDarkMusic() {
    play("dark", { loop: true });
}

export function playPositiveSound() {
    play("positive");
}

export function playNegativeSound() {
    play("negative");
}

export function playBoomSound() {
    play("boom");
}

export function playBooSound() {
    play("boo");
}
