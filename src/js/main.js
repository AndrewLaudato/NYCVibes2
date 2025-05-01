// src/js/main.js

import { loadSprite, loadSound, scene, go } from "./context.js";
import { createStartScene } from "./scenes/start.js";
import { createMainScene } from "./scenes/city.js";
import { createEndScene } from "./scenes/end.js";

// Load all assets that exist in /static
Promise.all([
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
    loadSprite("explosion", "static/explosion.png"),
    loadSound("background", "static/bg_music.mp3"),
    loadSound("dark", "static/dark.mp3"),
    loadSound("positive", "static/positive.wav"),
    loadSound("negative", "static/negative.wav"),
    loadSound("boom", "static/boom.wav"),
    loadSound("boo", "static/boo.mp3"),
]).then(() => {
    // Register scenes
    scene("start", createStartScene());
    scene("city", createMainScene());
    scene("end", createEndScene());

    // Start the game at start scene
    go("start");
}).catch(error => {
    console.error("Failed to load assets:", error);
    // Optional: show a nice error screen
});
