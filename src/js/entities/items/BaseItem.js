import { add, sprite, pos, rgb, scale, opacity, z, destroy, play } from '../../context.js';
import { mapWidth, mapHeight, DOG_POOP_TIMER } from '../../config/constants.js';
import { ITEM_MESSAGES } from '../../config/messages.js';

export class BaseItem {
    constructor(type, gameState, player) {
        this.type = type;
        this.gameState = gameState;
        this.player = player;
        this.sprite = null;
    }

    spawn() {
        const x = Math.random() * (mapWidth - 64);
        const y = Math.random() * (mapHeight - 64);
        return this.spawnAt(x, y);
    }

    spawnAt(x, y) {
        this.sprite = add([
            sprite(this.type, { width: 64, height: 64 }),
            pos(x, y),
            area(),
            z(1),
            this.type
        ]);

        // Add collision handling
        this.sprite.onCollide("player", () => {
            if (this.sprite) {
                this.handleCollision();
            }
        });

        // If this is a dog, transform it to poop after DOG_POOP_TIMER seconds
        if (this.type === "dog") {
            wait(DOG_POOP_TIMER, () => {
                if (this.sprite && this.sprite.exists()) {
                    this.transformToPoop();
                }
            });
        }

        return this.sprite;
    }

    transformToPoop() {
        if (this.sprite) {
            const pos = this.sprite.pos;
            this.destroy();
            this.type = "poop";
            this.spawnAt(pos.x, pos.y);
        }
    }

    handleCollision() {
        // Show a random message for this item type
        const messages = ITEM_MESSAGES[this.type];
        if (messages && this.player && typeof this.player.showMessage === 'function') {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            this.player.showMessage(msg);
        }

        // Play sound based on item type
        let positivePoints = 5;
        if (this.gameState.sunDoublePoints) positivePoints *= 2;
        switch(this.type) {
            case "coffee":
            case "pizza":
            case "pretzel":
            case "bagels":
            case "museum":
            case "sun":
            case "taxi":
            case "subway":
                play("positive");
                this.gameState.vibes += positivePoints;  // Positive items give 5 or 10 vibes
                break;
            case "poop":
            case "construction":
            case "rain":
            case "tourist":
                play("negative");
                this.gameState.vibes -= 5;  // Negative items take 5 vibes
                break;
            case "dog":
                play("positive");
                this.gameState.vibes += (this.gameState.sunDoublePoints ? 20 : 10);  // Dogs give 10 or 20 vibes
                break;
        }

        // Handle special effects and inventory items
        switch(this.type) {
            case "museum":
                if (!this.gameState.inventory.includes("map")) {
                    this.gameState.inventory.push("map");
                }
                break;
            case "sun":
                if (this.gameState.activateSunEffect) {
                    this.gameState.activateSunEffect();
                }
                break;
            case "edible":
                if (this.gameState.activateEdibleEffect) {
                    this.gameState.activateEdibleEffect();
                }
                break;
            case "grenade":
                if (!this.gameState.inventory.includes("grenade")) {
                    this.gameState.inventory.push("grenade");
                }
                break;
        }

        this.destroy();
    }

    destroy() {
        if (this.sprite) {
            destroy(this.sprite);
            this.sprite = null;
        }
    }

    onCollide(callback) {
        if (this.sprite) {
            this.sprite.onCollide(callback);
        }
    }

    exists() {
        return this.sprite && this.sprite.exists();
    }
} 