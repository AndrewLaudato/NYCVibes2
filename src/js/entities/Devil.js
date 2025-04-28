import { 
    DEVIL_SPEED, 
    DEVIL_VIBES_PENALTY, 
    DEVIL_MIN_INTERVAL,
    DEVIL_LIFESPAN,
    DEVIL_SPAWN_CHANCE,
    DEVIL_INITIAL_DELAY,
    mapWidth, 
    mapHeight 
} from '../config/constants.js';
import { play } from '../context.js';

export class Devil {
    constructor(gameState, backgroundMusicHandle) {
        this.gameState = gameState;
        this.sprite = null;
        this.darkMusic = null;
        this.backgroundMusic = backgroundMusicHandle;
        this.spawnedAt = 0;
        this.initialSpawnTime = 0;
    }

    spawn(player) {
        if (!player || this.sprite) return;

        const angle = Math.random() * Math.PI * 2;
        const distance = 300 + Math.random() * 200;
        const x = player.pos.x + Math.cos(angle) * distance;
        const y = player.pos.y + Math.sin(angle) * distance;

        const boundedX = Math.max(0, Math.min(x, mapWidth - 64));
        const boundedY = Math.max(0, Math.min(y, mapHeight - 64));

        this.sprite = add([
            sprite("devil", { width: 64, height: 64 }),
            pos(boundedX, boundedY),
            area(),
            z(2),
            "devil",
            "noControl"
        ]);

        this.spawnedAt = time();
        this.gameState.devil = this;
        this.playDarkMusic();
    }

    playDarkMusic() {
        if (this.backgroundMusic && typeof this.backgroundMusic.stop === 'function') {
            console.log('Stopping background music');
            this.backgroundMusic.stop();
        }
        console.log('Playing dark music');
        this.darkMusic = play("dark", { volume: 1.0, loop: true });
        console.log('Dark music handle:', this.darkMusic);
    }

    stopDarkMusic() {
        if (this.darkMusic && typeof this.darkMusic.stop === 'function') {
            console.log('Stopping dark music');
            this.darkMusic.stop();
            this.darkMusic = null;
        }
        if (this.backgroundMusic) {
            console.log('Restarting background music');
            this.backgroundMusic = play("bgm", { volume: 0.5, loop: true });
        }
    }

    update(player) {
        if (!this.sprite || !this.sprite.exists() || !player) return;

        const dx = player.pos.x - this.sprite.pos.x;
        const dy = player.pos.y - this.sprite.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            const moveX = (dx / dist) * DEVIL_SPEED;
            const moveY = (dy / dist) * DEVIL_SPEED;
            this.sprite.move(moveX, moveY);
        }

        if (time() - this.spawnedAt > DEVIL_LIFESPAN) {
            this.destroy(false);
        }
    }

    handleCollision(player) {
        if (!this.sprite || !this.sprite.exists()) return;

        if (this.gameState.inventory.includes("grenade")) {
            this.gameState.inventory = this.gameState.inventory.filter(item => item !== "grenade");
            add([
                circle(20),
                pos(this.sprite.pos),
                rgb(255, 0, 0),
                scale(1),
                opacity(0.8),
                z(100),
                {
                    update() {
                        this.scale += 0.5;
                        this.opacity -= 0.05;
                        if (this.opacity <= 0) {
                            destroy(this);
                        }
                    }
                }
            ]);
            play("boom");
            this.destroy(true);
        } else {
            this.gameState.vibes = Math.max(0, this.gameState.vibes - DEVIL_VIBES_PENALTY);
            play("negative");
            this.destroy(false);
            this.gameState.lastDevilDestroyed = time();
        }
    }

    destroy(permanent = false) {
        if (this.sprite) {
            destroy(this.sprite);
            this.sprite = null;
        }
        this.stopDarkMusic();
        if (permanent) {
            this.isDestroyed = true;
        }
        this.gameState.devil = null;
    }
}
