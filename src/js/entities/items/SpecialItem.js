// src/js/entities/SpecialItem.js

import {
    add, text as addText, pos, anchor, color, fixed, z, lifespan, time, wait, center, height
} from "../../context.js";
import { BaseItem } from "./BaseItem.js";
import { EDIBLE_DURATION, SUN_DURATION } from "../../config/constants.js";
import { context } from "../../context.js"; // (Optional if needed later)

export class SpecialItem extends BaseItem {
    constructor(config) {
        super(config.type, config.gameState, config.player);
        this.effect = config.effect;
        this.duration = config.duration || 0;
        this.effectStartTime = 0;
        this.isActive = false;
    }

    applyEffect(gameState) {
        this.effectStartTime = time();
        this.isActive = true;

        switch (this.effect) {
            case "edible":
                gameState.edibleTimers.push(time());
                this.showMessage("Feeling funny...", [255, 100, 255]);
                break;
            case "sun":
                gameState.sunActive = true;
                gameState.sunTimer = time();
                this.showMessage("Sunshine boost activated!", [255, 255, 0]);
                break;
            // Add more effects here if needed
        }

        if (this.duration > 0) {
            wait(this.duration, () => this.removeEffect(gameState));
        }
    }

    removeEffect(gameState) {
        this.isActive = false;

        switch (this.effect) {
            case "edible":
                gameState.edibleTimers = gameState.edibleTimers.filter(
                    (t) => time() - t < EDIBLE_DURATION
                );
                break;
            case "sun":
                if (time() - gameState.sunTimer > SUN_DURATION) {
                    gameState.sunActive = false;
                }
                break;
        }
    }

    showMessage(message, colorValue) {
