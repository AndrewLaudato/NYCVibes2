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
        
        let backgroundMusic = null;
        // Only play background music if enabled
        if (MUSIC_ENABLED) {
            backgroundMusic = play("background", {
                volume: 0.5,
                loop: true,
            });
        }
        
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
                gameState.devil.handleCollision(playerSprite);
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

            if (canSpawnDevil && !gameState.devil) {
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
                const colors = EDIBLE_COLORS;
                const color = colors[Math.floor(time() * 10) % colors.length];
                add([
                    rect(width(), height()),
                    pos(0, 0),
                    rgb(...color),
                    k.opacity(0.3),
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
