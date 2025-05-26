// src/js/entities/Devil.js

import { add, sprite, area, body, move, destroy, pos, scale, z, play, loadSprite, width, height, rand, wait, time } from "../context.js";
import { DEVIL_SPAWN_CHANCE, DEVIL_INITIAL_DELAY, MUSIC_ENABLED, PLAYER_WIDTH, PLAYER_HEIGHT, mapWidth, mapHeight, DEVIL_VIBES_PENALTY, DEVIL_LIFESPAN, DEVIL_SPEED } from "../config/constants.js";

let explosionSpriteLoaded = false;

function loadExplosionSprite() {
    if (!explosionSpriteLoaded) {
        loadSprite("explosion", "static/explosion.png");
        explosionSpriteLoaded = true;
    }
}

export class Devil {
    constructor(gameState, backgroundMusic) {
        this.gameState = gameState;
        this.backgroundMusic = backgroundMusic;
        this.sprite = null;
        this.darkMusic = null;
    }

    spawn(playerSprite) {
        console.log("Devil spawn called");
        if (this.sprite || this.gameState.devilPermanentlyDead) return;
        if (Math.random() >= DEVIL_SPAWN_CHANCE) return;
        console.log("Devil is spawning!");

        // Find a spawn position at least 300px from player
        let spawnPos;
        do {
            spawnPos = {
                x: rand(0, mapWidth),
                y: rand(0, mapHeight)
            };
        } while (playerSprite.pos.dist(spawnPos) < 300);

        this.sprite = add([
            sprite("devil", { width: PLAYER_WIDTH, height: PLAYER_HEIGHT }),
            pos(spawnPos.x, spawnPos.y),
            area(),
            body(),
            "devil",
            z(10),
        ]);

        // Devil disappears after DEVIL_LIFESPAN seconds if not caught
        this.lifespanTimer = wait(DEVIL_LIFESPAN, () => {
            if (this.sprite && this.sprite.exists()) {
                this.destroy(false);
            }
        });

        // Handle music switching
        if (MUSIC_ENABLED) {
            try {
                // Stop background music first
                if (this.backgroundMusic) {
                    this.backgroundMusic.stop();
                }
                // Then play dark music
                this.darkMusic = play("devil_music", { loop: true, volume: 0.5 });
                console.log("Devil music started", this.darkMusic);
            } catch (e) {
                console.error("Error playing devil music:", e);
            }
        }
    }

    update(playerSprite) {
        if (!this.sprite || !this.sprite.exists()) return;
        // Move towards player at DEVIL_SPEED
        const direction = playerSprite.pos.sub(this.sprite.pos).unit();
        this.sprite.move(direction.scale(DEVIL_SPEED));
    }

    handleCollision(playerSprite) {
        if (!this.sprite || !this.sprite.exists()) return;
        // Reduce player's vibes by DEVIL_VIBES_PENALTY
        this.gameState.vibes -= DEVIL_VIBES_PENALTY;
        play("negative");
        this.destroy(false);
    }

    destroy(permanently = false) {
        console.log("Devil destroy called");
        if (this.lifespanTimer) {
            this.lifespanTimer.cancel && this.lifespanTimer.cancel();
            this.lifespanTimer = null;
        }
        if (this.sprite) {
            destroy(this.sprite);
            this.sprite = null;
        }
        // Handle music switching
        if (MUSIC_ENABLED) {
            // Stop dark music first
            if (this.darkMusic) {
                console.log("Stopping devil music", this.darkMusic);
                this.darkMusic.stop();
                this.darkMusic = null;
            }
            // Then resume background music
            if (this.backgroundMusic) {
                console.log("Resuming background music", this.backgroundMusic);
                this.backgroundMusic.play();
            }
        }
        if (permanently) {
            this.gameState.devilPermanentlyDead = true;
        }
        // Update lastDevilSpawn and clear devil reference
        this.gameState.lastDevilSpawn = time();
        this.gameState.devil = null;
    }

    triggerExplosion(atPos) {
        loadExplosionSprite();

        const explosion = add([
            sprite("explosion"),
            pos(atPos),
            scale(1),
            z(20),
        ]);

        try {
            play("boom", { volume: 0.7 });
        } catch (e) {
            console.error("Error playing explosion sound:", e);
        }

        wait(0.5, () => {
            destroy(explosion);
        });
    }
}
