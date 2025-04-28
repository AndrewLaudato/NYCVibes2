import { loadSprite, loadSound, scene, go } from './context.js';
import { createStartScene } from './scenes/start.js';
import { createMainScene } from './scenes/city.js';
import { createEndScene } from './scenes/end.js';
import { WIN_VIBES, LOSE_VIBES } from './config/constants.js';
import { add, sprite, text, pos, anchor, color, fixed, z, rect, area, onKeyDown, onUpdate, camPos, play, width, height, center } from './context.js';

// Load all assets that actually exist in static/
Promise.all([
    // Sprites
    loadSprite("start", "static/start_screen.jpg"),
    loadSprite("win_screen", "static/win_screen.jpg"),
    loadSprite("lose_screen", "static/lose_screen.jpg"),
    loadSprite("map", "static/NYCmap.jpg"),
    loadSprite("player", "static/KJK.png"),
    loadSprite("devil", "static/devil.png"),
    loadSprite("bagels", "static/bagels.png"),
    loadSprite("coffee", "static/coffee.png"),
    loadSprite("construction", "static/construction.png"),
    loadSprite("dog", "static/dog.png"),
    loadSprite("edible", "static/edible.png"),
    loadSprite("grenade", "static/grenade.png"),
    loadSprite("homeless", "static/homeless.png"),
    loadSprite("museum", "static/museum.png"),
    loadSprite("pizza", "static/pizza.png"),
    loadSprite("poop", "static/poop.png"),
    loadSprite("pretzel", "static/pretzel.png"),
    loadSprite("rain", "static/rain.png"),
    loadSprite("subway", "static/subway.png"),
    loadSprite("sun", "static/sun.png"),
    loadSprite("taxi", "static/taxi.png"),
    loadSprite("tourist", "static/tourist.png"),
    // Sounds
    loadSound("bgm", "static/bg_music.mp3"),
    loadSound("positive", "static/positive.wav"),
    loadSound("negative", "static/negative.wav"),
    loadSound("dark", "static/dark.mp3"),
    loadSound("boom", "static/boom.wav"),
    loadSound("boo", "static/boo.mp3"),
]).then(() => {
    // Register scenes
    scene("start", createStartScene());
    scene("game", createMainScene());
    scene("win", createEndScene());
    scene("lose", createEndScene());

    // Start the game
    go("start");
}).catch(error => {
    // Handle asset loading errors
    console.error("Failed to load assets:", error);
    // Optionally show an error message using Kaboom's add/text
}); 