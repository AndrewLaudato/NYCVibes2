import kaboom from 'https://unpkg.com/kaboom@3000.0.0/dist/kaboom.mjs';
const { add, text, pos, anchor, color, fixed, z, lifespan, time, wait, center, height } = kaboom;
import { BaseItem } from './BaseItem.js';
import { EDIBLE_DURATION, SUN_DURATION } from '../../config/constants.js';

export class SpecialItem extends BaseItem {
    constructor(config) {
        super(config);
        this.effectStartTime = 0;
        this.isActive = false;
    }

    applyEffect(gameState) {
        this.effectStartTime = time();
        this.isActive = true;

        switch(this.effect) {
            case 'edible':
                gameState.edibleTimers.push(time());
                this.showMessage("Feeling funny...", [255, 100, 255]);
                break;
            case 'sun':
                gameState.sunActive = true;
                gameState.sunTimer = time();
                this.showMessage("Sunshine boost activated!", [255, 255, 0]);
                break;
            // Add more effects here
        }

        if (this.duration > 0) {
            wait(this.duration, () => this.removeEffect(gameState));
        }
    }

    removeEffect(gameState) {
        this.isActive = false;
        
        switch(this.effect) {
            case 'edible':
                gameState.edibleTimers = gameState.edibleTimers.filter(t => time() - t < EDIBLE_DURATION);
                break;
            case 'sun':
                if (time() - gameState.sunTimer > SUN_DURATION) {
                    gameState.sunActive = false;
                }
                break;
        }
    }

    showMessage(text, color) {
        add([
            text(text, { size: 24 }),
            pos(center().x, height() - 100),
            anchor("center"),
            color(color[0], color[1], color[2]),
            fixed(),
            z(101),
            lifespan(2),
        ]);
    }

    isEffectActive() {
        return this.isActive && (this.duration === 0 || time() - this.effectStartTime < this.duration);
    }
} 