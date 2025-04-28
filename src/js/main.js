import { createStartScene } from './scenes/start';
import { createGameScene } from './scenes/game';
import { createEndScene } from './scenes/end';
import { WIN_VIBES, LOSE_VIBES } from './config/constants.js';
import { add, sprite, text, pos, anchor, color, fixed, z, rect, area, onKeyDown, onUpdate, camPos, play } from 'https://unpkg.com/kaboom@3000.0.0/dist/kaboom.mjs';
import { width, height, center } from 'https://unpkg.com/kaboom@3000.0.0/dist/kaboom.mjs';

// Load assets
loadSprite('player', 'assets/sprites/player.png');
loadSprite('devil', 'assets/sprites/devil.png');
loadSprite('background', 'assets/sprites/background.png');
loadSprite('startButton', 'assets/sprites/startButton.png');
loadSprite('restartButton', 'assets/sprites/restartButton.png');
loadSprite('food', 'assets/sprites/food.png');
loadSprite('special', 'assets/sprites/special.png');
loadSprite('transport', 'assets/sprites/transport.png');

// Create scenes
createStartScene();
createGameScene();
createEndScene();

// Start with the start scene
go('start'); 