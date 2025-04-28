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
        console.log('Devil.spawn() called');
        if (!player || this.sprite) {
            console.log('Devil.spawn() early return: no player or already spawned');
            return;
        }
        
        // Check initial delay
        if (this.initialSpawnTime === 0) {
            this.initialSpawnTime = time();
            console.log('Devil.spawn() initialSpawnTime set, returning');
            return;
        }
        if (time() - this.initialSpawnTime < DEVIL_INITIAL_DELAY) {
            console.log('Devil.spawn() waiting for DEVIL_INITIAL_DELAY');
            return;
        }

        // Check cooldown
        if (time() - this.gameState.lastDevilDestroyed < DEVIL_MIN_INTERVAL) {
            console.log('Devil.spawn() waiting for DEVIL_MIN_INTERVAL');
            return;
        }

        // Check spawn chance
        if (Math.random() > DEVIL_SPAWN_CHANCE) {
            console.log('Devil.spawn() failed DEVIL_SPAWN_CHANCE');
            return;
        }

        // Calculate spawn position away from player
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
        console.log('Devil spawned at', boundedX, boundedY);
    }

    playDarkMusic() {
        // Fade out background music
        if (this.backgroundMusic) {
            this.fadeOutMusic(this.backgroundMusic);
        }
        // Play and fade in dark music
        this.darkMusic = play("dark", { volume: 0, loop: true });
        this.fadeInMusic(this.darkMusic, 0.3);
    }

    stopDarkMusic() {
        // Fade out and stop dark music
        if (this.darkMusic) {
            this.fadeOutMusic(this.darkMusic, () => {
                if (this.darkMusic && typeof this.darkMusic.stop === 'function') {
                    this.darkMusic.stop();
                    this.darkMusic = null;
                }
            });
        }
        // Fade in/resume background music
        if (this.backgroundMusic) {
            this.fadeInMusic(this.backgroundMusic, 0.5);
        }
    }

    fadeInMusic(musicHandle, targetVolume = 0.3, step = 0.05, interval = 50) {
        if (!musicHandle || typeof musicHandle.volume !== 'function') return;
        let vol = 0;
        musicHandle.volume(0);
        const fade = setInterval(() => {
            vol += step;
            if (vol >= targetVolume) {
                vol = targetVolume;
                clearInterval(fade);
            }
            musicHandle.volume(vol);
        }, interval);
    }

    fadeOutMusic(musicHandle, onComplete, step = 0.05, interval = 50) {
        if (!musicHandle || typeof musicHandle.volume !== 'function') {
            if (onComplete) onComplete();
            return;
        }
        let vol = musicHandle.volume();
        const fade = setInterval(() => {
            vol -= step;
            if (vol <= 0) {
                vol = 0;
                clearInterval(fade);
                musicHandle.volume(0);
                if (onComplete) onComplete();
            } else {
                musicHandle.volume(vol);
            }
        }, interval);
    }

    update(player) {
        if (!this.sprite || !this.sprite.exists() || !player) return;

        // Move towards player at full speed
        const dx = player.pos.x - this.sprite.pos.x;
        const dy = player.pos.y - this.sprite.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            const moveX = (dx / dist) * DEVIL_SPEED;
            const moveY = (dy / dist) * DEVIL_SPEED;
            this.sprite.move(moveX, moveY);
        }

        // Check lifespan
        if (time() - this.spawnedAt > DEVIL_LIFESPAN) {
            this.destroy(false);
        }
    }

    handleCollision(player) {
        if (!this.sprite || !this.sprite.exists()) return;

        if (this.gameState.inventory.includes("grenade")) {
            // Use grenade - permanent destruction
            this.gameState.inventory = this.gameState.inventory.filter(item => item !== "grenade");
            
            // Create explosion effect
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
            // Player caught by devil
            this.gameState.vibes = Math.max(0, this.gameState.vibes - DEVIL_VIBES_PENALTY);
            play("negative");
            this.destroy(false);
            this.gameState.lastDevilDestroyed = time(); // Record when devil was destroyed
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