// src/js/scenes/city.js

import {
    add,
    sprite,
    text,
    pos,
    color,
    fixed,
    z,
    rect,
    area,
    onUpdate,
    camPos,
    play,
    width,
    height,
    center,
    anchor,
    onKeyDown,
    rgb,
    lifespan,
    wait,
    time,
    go,
    k,
    onKeyPress,
} from '../context.js';

import {
    mapWidth,
    mapHeight,
    UI_HEIGHT,
    UI_FONT_SIZE,
    UI_TEXT_COLOR,
    UI_BG_COLOR,
    PLAYER_SPEED,
    WIN_VIBES,
    LOSE_VIBES,
    ITEM_SPAWN_INTERVAL_MIN,
    ITEM_SPAWN_INTERVAL_MAX,
    ITEM_WIDTH,
    ITEM_HEIGHT,
    DEVIL_INITIAL_DELAY,
    SUN_COLOR,
    EDIBLE_COLORS,
    INITIAL_VIBES,
    GRENADE_FIRST_SPAWN_DELAY,
    MUSIC_ENABLED
} from '../config/constants.js';

import { GameState } from '../utils/gameControl.js';
import { Player } from '../entities/Player.js';
import { Devil } from '../entities/Devil.js';
import { BaseItem } from '../entities/items/BaseItem.js';

export const gameScene = createMainScene();

export function createMainScene() {
    return () => {
        const gameState = new GameState();
        gameState.vibes = INITIAL_VIBES;
        
        // Music toggle with M key
        let musicEnabled = false;
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem("musicEnabled");
            if (stored !== null) musicEnabled = stored === "true";
        }
        let backgroundMusic = null;
        function updateMusic() {
            try {
                if (musicEnabled) {
                    if (!backgroundMusic) {
                        backgroundMusic = play("background_music", { volume: 0.5, loop: true });
                    }
                } else {
                    if (backgroundMusic) {
                        backgroundMusic.stop();
                        backgroundMusic = null;
                    }
                }
            } catch (e) {
                console.error("Music play/stop error", e);
            }
        }
        onKeyPress("m", () => {
            musicEnabled = !musicEnabled;
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem("musicEnabled", musicEnabled);
            }
            updateMusic();
        });
        updateMusic();
        
        const player = new Player(gameState);
        let gameStartTime = time();
        let canSpawnDevil = false;
        let canSpawnGrenade = false;

        // Map background
        add([
            sprite("map", { width: mapWidth, height: mapHeight }),
            pos(0, 0),
            z(-1),
        ]);

        // Initialize player
        const playerSprite = player.spawn();

        // UI Container
        add([
            rect(width(), UI_HEIGHT),
            pos(0, 0),
            color(...UI_BG_COLOR),
            k.opacity(1),
            fixed(),
            z(99),
        ]);

        // Header labels
        const vibesLabel = add([
            text(`Vibes: ${gameState.vibes}`, { size: UI_FONT_SIZE }),
            pos(20, 50),
            color(...UI_TEXT_COLOR),
            fixed(),
            z(100),
        ]);

        const durationLabel = add([
            text("Duration: 0:00", { size: UI_FONT_SIZE }),
            pos(250, 50),
            color(...UI_TEXT_COLOR),
            fixed(),
            z(100),
        ]);

        const milesLabel = add([
            text("Miles: 0.0", { size: UI_FONT_SIZE }),
            pos(500, 50),
            color(...UI_TEXT_COLOR),
            fixed(),
            z(100),
        ]);

        const itemsLabel = add([
            text("Items: ", { size: UI_FONT_SIZE }),
            pos(750, 50),
            color(...UI_TEXT_COLOR),
            fixed(),
            z(100),
        ]);

        // Title
        add([
            text("NYC Vibes", { size: 36 }),
            pos(center().x, 20),
            anchor("center"),
            color(...UI_TEXT_COLOR),
            fixed(),
            z(100),
        ]);

        // Player movement
        onKeyDown("left", () => {
            if (playerSprite && playerSprite.exists() && !playerSprite.is("enemy")) {
                playerSprite.move(-PLAYER_SPEED, 0);
            }
        });
        onKeyDown("right", () => {
            if (playerSprite && playerSprite.exists() && !playerSprite.is("enemy")) {
                playerSprite.move(PLAYER_SPEED, 0);
            }
        });
        onKeyDown("up", () => {
            if (playerSprite && playerSprite.exists() && !playerSprite.is("enemy")) {
                playerSprite.move(0, -PLAYER_SPEED);
            }
        });
        onKeyDown("down", () => {
            if (playerSprite && playerSprite.exists() && !playerSprite.is("enemy")) {
                playerSprite.move(0, PLAYER_SPEED);
            }
        });

        // Initial spawn of coffee and dog near player
        const spawnInitialItems = () => {
            const coffeeAngle = Math.random() * Math.PI * 2;
            const coffeeDistance = 200 + Math.random() * 100;
            const coffeeX = playerSprite.pos.x + Math.cos(coffeeAngle) * coffeeDistance;
            const coffeeY = playerSprite.pos.y + Math.sin(coffeeAngle) * coffeeDistance;
            const coffee = new BaseItem("coffee", gameState, player);
            coffee.spawnAt(coffeeX, coffeeY);

            const dogAngle = (coffeeAngle + Math.PI) % (Math.PI * 2);
            const dogDistance = 200 + Math.random() * 100;
            const dogX = playerSprite.pos.x + Math.cos(dogAngle) * dogDistance;
            const dogY = playerSprite.pos.y + Math.sin(dogAngle) * dogDistance;
            const dog = new BaseItem("dog", gameState, player);
            dog.spawnAt(dogX, dogY);
        };

        // Regular item spawning
        const spawnItem = () => {
            const itemTypes = [
                "dog", "poop", "pizza", "pretzel", "bagels", "coffee",
                "museum", "tourist", "edible", "sun",
                "construction", "rain", "taxi", "subway"
            ];

            if (canSpawnGrenade) {
                itemTypes.push("grenade");
            }

            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const x = Math.random() * (mapWidth - ITEM_WIDTH);
            const y = Math.random() * (mapHeight - ITEM_HEIGHT);
            const item = new BaseItem(itemType, gameState, player);
            item.spawnAt(x, y);
        };

        // Spawn initial items
        spawnInitialItems();

        // Start regular item spawning
        const spawnInterval = () => {
            spawnItem();
            const interval = ITEM_SPAWN_INTERVAL_MIN + Math.random() * (ITEM_SPAWN_INTERVAL_MAX - ITEM_SPAWN_INTERVAL_MIN);
            wait(interval, spawnInterval);
        };
        spawnInterval();

        // Handle collisions
        playerSprite.onCollide("dog", () => {
            play("positive");
        });

        playerSprite.onCollide("devil", () => {
            if (gameState.devil) {
                // If player has grenade, destroy devil permanently and remove grenade
                if (gameState.inventory.includes("grenade")) {
                    if (gameState.devil.sprite && gameState.devil.sprite.exists()) {
                        play("boom");
                        gameState.devil.triggerExplosion(gameState.devil.sprite.pos);
                        gameState.devil.destroy(true);
                        gameState.inventory = gameState.inventory.filter(item => item !== "grenade");
                    }
                } else {
                    // Just handle collision without explosion
                    gameState.devil.handleCollision(playerSprite);
                }
            }
        });

        playerSprite.onCollide("subway", () => {
            if (gameState.devil && gameState.devil.sprite && gameState.devil.sprite.exists()) {
                gameState.devil.destroy(false);
                play("positive");
            }
        });

        playerSprite.onCollide("taxi", () => {
            if (gameState.devil && gameState.devil.sprite && gameState.devil.sprite.exists()) {
                gameState.devil.destroy(false);
                play("positive");
            }
        });

        // Camera follows player
        onUpdate(() => {
            camPos(playerSprite.pos);
        });

        // Main game loop
        onUpdate(() => {
            player.update();

            vibesLabel.text = `Vibes: ${gameState.vibes}`;
            if (gameState.vibes >= WIN_VIBES - 10) {
                vibesLabel.color = rgb(0, 200, 0); // green
            } else if (gameState.vibes <= LOSE_VIBES + 10) {
                vibesLabel.color = rgb(200, 0, 0); // red
            } else {
                vibesLabel.color = rgb(...UI_TEXT_COLOR); // default
            }
            const miles = player.getDistanceWalked();
            milesLabel.text = `Miles: ${miles.toFixed(1)}`;
            const elapsed = time() - gameStartTime;
            const minutes = Math.floor(elapsed / 60);
            const seconds = Math.floor(elapsed % 60);
            durationLabel.text = `Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            itemsLabel.text = `Items: ${gameState.inventory.join(', ')}`;

            if (!canSpawnDevil && time() - gameStartTime > DEVIL_INITIAL_DELAY) {
                canSpawnDevil = true;
            }

            if (!canSpawnGrenade && time() - gameStartTime > GRENADE_FIRST_SPAWN_DELAY) {
                canSpawnGrenade = true;
            }

            if (canSpawnDevil && gameState.canSpawnDevil()) {
                gameState.devil = new Devil(gameState, backgroundMusic);
            }
            if (gameState.devil && !gameState.devil.sprite) {
                gameState.devil.spawn(playerSprite);
            }
            if (gameState.devil && gameState.devil.sprite) {
                gameState.devil.update(playerSprite);
            }

            gameState.updateSunEffect();

            if (gameState.sunEffectActive) {
                add([
                    rect(width(), height()),
                    pos(0, 0),
                    rgb(...SUN_COLOR),
                    k.opacity(0.2),
                    fixed(),
                    z(98),
                    lifespan(0.1),
                ]);
            }

            if (gameState.edibleEffectActive) {
                // Psychedelic effect: rapidly shifting rainbow overlay with wavy alpha
                const t = time();
                const hue = (t * 120) % 360; // cycle hue quickly
                const sat = 100;
                const light = 50 + 20 * Math.sin(t * 2); // pulsate lightness
                const alpha = 0.25 + 0.15 * Math.sin(t * 4); // wavy alpha
                // Kaboom doesn't support hsl directly, so convert to rgb
                function hslToRgb(h, s, l) {
                    s /= 100;
                    l /= 100;
                    const k = n => (n + h / 30) % 12;
                    const a = s * Math.min(l, 1 - l);
                    const f = n => l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
                    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
                }
                const [r, g, b] = hslToRgb(hue, sat, light);
                add([
                    rect(width(), height()),
                    pos(0, 0),
                    rgb(r, g, b),
                    k.opacity(alpha),
                    fixed(),
                    z(98),
                    lifespan(0.1),
                ]);
            }

            const gameOver = gameState.checkGameOver();
            if (gameOver.gameOver) {
                if (gameState.currentMusic && typeof gameState.currentMusic.stop === 'function') {
                    gameState.currentMusic.stop();
                }
                go(gameOver.result);
            }
        });

        // Return cleanup function
        return {
            cleanup() {
                if (backgroundMusic) {
                    backgroundMusic.stop();
                }
                if (gameState.devil && gameState.devil.darkMusic) {
                    gameState.devil.darkMusic.stop();
                }
                // Clean up any other resources if needed
            }
        };
    };
}
