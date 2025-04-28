import { 
    mapWidth, mapHeight, UI_HEIGHT, UI_FONT_SIZE, UI_TEXT_COLOR, UI_BG_COLOR,
    PLAYER_SPEED, WIN_VIBES, LOSE_VIBES, ITEM_SPAWN_INTERVAL_MIN, ITEM_SPAWN_INTERVAL_MAX, 
    ITEM_WIDTH, ITEM_HEIGHT, DEVIL_INITIAL_DELAY, SUN_COLOR, EDIBLE_COLORS, 
    INITIAL_VIBES, GRENADE_FIRST_SPAWN_DELAY 
} from '../config/constants.js';
import { GameState } from '../utils/gameState.js';
import { Player } from '../entities/Player.js';
import { Devil } from '../entities/Devil.js';
import { BaseItem } from '../entities/items/BaseItem.js';
import { SpecialItem } from '../entities/items/SpecialItem.js';
import { TransportationItem } from '../entities/items/TransportationItem.js';

export function createMainScene() {
    return () => {
        const gameState = new GameState();
        gameState.vibes = INITIAL_VIBES;  // Initialize vibes
        const backgroundMusic = play("bgm", {
            volume: 0.5,
            loop: true,
        });
        const player = new Player(gameState);
        let gameStartTime = time();
        let canSpawnDevil = false;
        let canSpawnGrenade = false;

        // Initialize game
        const playerSprite = player.spawn();
        
        // Map background
        add([
            sprite("map", { width: mapWidth, height: mapHeight }),
            pos(0, 0),
            z(-1)
        ]);

        // UI Container
        const uiContainer = add([
            rect(width, UI_HEIGHT),
            pos(0, 0),
            color(UI_BG_COLOR[0], UI_BG_COLOR[1], UI_BG_COLOR[2]),
            opacity(1),
            fixed(),
            z(99),
        ]);

        // Header labels in a single row
        const vibesLabel = add([
            text(`Vibes: ${gameState.vibes}`, { 
                size: UI_FONT_SIZE, 
                font: "Arial",
            }),
            pos(20, 50), 
            color(UI_TEXT_COLOR[0], UI_TEXT_COLOR[1], UI_TEXT_COLOR[2]),
            fixed(),
            z(100),
        ]);

        const durationLabel = add([
            text("Duration: 0:00", { 
                size: UI_FONT_SIZE,
                font: "Arial"
            }),
            pos(250, 50),
            color(UI_TEXT_COLOR[0], UI_TEXT_COLOR[1], UI_TEXT_COLOR[2]),
            fixed(),
            z(100),
        ]);

        const milesLabel = add([
            text("Miles: 0.0", { 
                size: UI_FONT_SIZE,
                font: "Arial"
            }),
            pos(500, 50),
            color(UI_TEXT_COLOR[0], UI_TEXT_COLOR[1], UI_TEXT_COLOR[2]),
            fixed(),
            z(100),
        ]);

        const itemsLabel = add([
            text("Items: ", {
                size: UI_FONT_SIZE,
                font: "Arial"
            }),
            pos(750, 50),
            color(UI_TEXT_COLOR[0], UI_TEXT_COLOR[1], UI_TEXT_COLOR[2]),
            fixed(),
            z(100),
        ]);

        // Title
        add([
            text("NYC Vibes", { 
                size: 36,
                font: "sans-serif"
            }),
            pos(center().x, 20),
            anchor("center"),
            color(UI_TEXT_COLOR[0], UI_TEXT_COLOR[1], UI_TEXT_COLOR[2]),
            fixed(),
            z(100),
        ]);

        // Player movement
        onKeyDown("left", () => {
            if (playerSprite && playerSprite.exists && !playerSprite.is("enemy")) {
                playerSprite.move(-PLAYER_SPEED, 0);
            }
        });
        onKeyDown("right", () => {
            if (playerSprite && playerSprite.exists && !playerSprite.is("enemy")) {
                playerSprite.move(PLAYER_SPEED, 0);
            }
        });
        onKeyDown("up", () => {
            if (playerSprite && playerSprite.exists && !playerSprite.is("enemy")) {
                playerSprite.move(0, -PLAYER_SPEED);
            }
        });
        onKeyDown("down", () => {
            if (playerSprite && playerSprite.exists && !playerSprite.is("enemy")) {
                playerSprite.move(0, PLAYER_SPEED);
            }
        });

        // Initial spawn of coffee and dog near player
        const spawnInitialItems = () => {
            // Spawn coffee
            const coffeeAngle = Math.random() * Math.PI * 2;
            const coffeeDistance = 200 + Math.random() * 100;
            const coffeeX = playerSprite.pos.x + Math.cos(coffeeAngle) * coffeeDistance;
            const coffeeY = playerSprite.pos.y + Math.sin(coffeeAngle) * coffeeDistance;
            const coffee = new BaseItem("coffee", gameState, player);
            coffee.spawnAt(coffeeX, coffeeY);

            // Spawn dog at different angle
            const dogAngle = (coffeeAngle + Math.PI) % (Math.PI * 2); // Opposite side of player
            const dogDistance = 200 + Math.random() * 100;
            const dogX = playerSprite.pos.x + Math.cos(dogAngle) * dogDistance;
            const dogY = playerSprite.pos.y + Math.sin(dogAngle) * dogDistance;
            const dog = new BaseItem("dog", gameState, player);
            dog.spawnAt(dogX, dogY);
        };

        // Regular item spawning (random on map)
        const spawnItem = () => {
            const itemTypes = [
                "dog", "poop", "pizza", "pretzel", "bagels", "coffee",
                "museum", "tourist", "edible", "sun",
                "construction", "rain", "taxi", "subway"
            ];

            // Add grenade to possible items only after delay
            if (canSpawnGrenade) {
                itemTypes.push("grenade");
            }
            
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            
            // Spawn anywhere on the map
            const x = Math.random() * (mapWidth - 64);
            const y = Math.random() * (mapHeight - 64);
            
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

        // Handle subway/taxi collision
        playerSprite.onCollide("subway", () => {
            if (gameState.devil && gameState.devil.sprite && gameState.devil.sprite.exists) {
                gameState.devil.destroy(false);
                play("positive");
            }
        });

        playerSprite.onCollide("taxi", () => {
            if (gameState.devil && gameState.devil.sprite && gameState.devil.sprite.exists) {
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
            // Update player (distance, miles, vibes)
            player.update();

            // Update vibes counter
            vibesLabel.text = `Vibes: ${gameState.vibes}`;
            
            // Update miles (use correct conversion from Player class)
            const miles = player.getDistanceWalked();
            milesLabel.text = `Miles: ${miles.toFixed(1)}`;
            
            // Update duration
            const elapsed = time() - gameStartTime;
            const minutes = Math.floor(elapsed / 60);
            const seconds = Math.floor(elapsed % 60);
            durationLabel.text = `Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update items
            itemsLabel.text = `Items: ${gameState.inventory.join(', ')}`;

            // Check if we can spawn devil
            if (!canSpawnDevil && time() - gameStartTime > DEVIL_INITIAL_DELAY) {
                canSpawnDevil = true;
            }

            // Check if we can spawn grenade
            if (!canSpawnGrenade && time() - gameStartTime > GRENADE_FIRST_SPAWN_DELAY) {
                canSpawnGrenade = true;
            }
            
            // Spawn devil if needed
            if (canSpawnDevil && !gameState.devil) {
                console.log('Attempting to spawn devil');
                gameState.devil = new Devil(gameState, backgroundMusic);
            }
            if (gameState.devil && !gameState.devil.sprite) {
                gameState.devil.spawn(playerSprite);
            }
            if (gameState.devil && gameState.devil.sprite) {
                gameState.devil.update(playerSprite);
            }
            
            // Update game state
            gameState.updateSunEffect();
            
            // Apply screen effects
            if (gameState.sunEffectActive) {
                add([
                    rect(width, height),
                    pos(0, 0),
                    rgb(SUN_COLOR[0], SUN_COLOR[1], SUN_COLOR[2]),
                    opacity(0.2),
                    fixed(),
                    z(98),
                    lifespan(0.1),
                ]);
            }
            
            if (gameState.edibleEffectActive) {
                const colors = EDIBLE_COLORS;
                const color = colors[Math.floor(time() * 10) % colors.length];
                add([
                    rect(width, height),
                    pos(0, 0),
                    rgb(color[0], color[1], color[2]),
                    opacity(0.3),
                    fixed(),
                    z(98),
                    lifespan(0.1),
                ]);
            }

            // Check game over
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
                // Clean up any other resources
            }
        };
    };
} 