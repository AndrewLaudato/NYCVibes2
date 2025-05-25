// src/js/entities/Devil.js

import { add, sprite, area, body, move, destroy, pos, scale, z, play, loadSprite, width, height, rand, wait } from "../context.js";
import { DEVIL_SPAWN_CHANCE, DEVIL_INITIAL_DELAY, MUSIC_ENABLED, PLAYER_WIDTH, PLAYER_HEIGHT } from "../config/constants.js";

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
        if (this.sprite) return;

        this.sprite = add([
            sprite("devil", { width: PLAYER_WIDTH, height: PLAYER_HEIGHT }),
            pos(rand(0, width()), rand(0, height())),
            area(),
            body(),
            "devil",
            z(10),
        ]);

        if (MUSIC_ENABLED) {
            this.darkMusic = play("dark", { loop: true });
            if (this.backgroundMusic) {
                this.backgroundMusic.stop();
            }
        }
    }

    update(playerSprite) {
        if (!this.sprite || !this.sprite.exists()) return;

        // Move towards player
        const direction = playerSprite.pos.sub(this.sprite.pos).unit();
        this.sprite.move(direction.scale(2));
    }

    handleCollision(playerSprite) {
        if (!this.sprite || !this.sprite.exists()) return;
        
        // Reduce player's vibes
        this.gameState.vibes -= 10;
        play("negative");
        
        // Trigger explosion at devil's position
        this.triggerExplosion(this.sprite.pos);
        
        // Destroy the devil
        this.destroy(false);
    }

    destroy(permanently = false) {
        if (this.sprite) {
            destroy(this.sprite);
            this.sprite = null;
        }

        if (MUSIC_ENABLED) {
            if (this.darkMusic) {
                this.darkMusic.stop();
            }
            if (this.backgroundMusic) {
                this.backgroundMusic.play();
            }
        }

        if (permanently) {
            this.gameState.devilPermanentlyDead = true;
        }
    }

    triggerExplosion(atPos) {
        loadExplosionSprite();

        const explosion = add([
            sprite("explosion"),
            pos(atPos),
            scale(1),
            z(20),
        ]);

        play("boom");

        wait(0.5, () => {
            destroy(explosion);
        });
    }
}
