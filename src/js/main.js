// src/js/main.js

import { scene, loadSprite, loadSound, go } from "./context.js";
import { startScene } from "./scenes/start.js";
import { gameScene } from "./scenes/city.js";
import { createEndScene } from "./scenes/end.js";

// Load the manifest
fetch("static/assetManifest.json")
  .then(res => res.json())
  .then(manifest => {
    // Load all sprites
    const spritePromises = Object.entries(manifest.sprites).map(
      ([name, path]) => loadSprite(name, path)
    );
    // Load all sounds
    const soundPromises = Object.entries(manifest.sounds).map(
      ([name, path]) => loadSound(name, path)
    );
    return Promise.all([...spritePromises, ...soundPromises]);
  })
  .then(() => {
    // Define scenes
    scene("start", startScene);
    scene("game", gameScene);
    scene("win", createEndScene()(true));
    scene("lose", createEndScene()(false));
    // Start with the start scene
    go("start");
  })
  .catch(error => {
    console.error("Failed to load assets:", error);
    // Show error on screen
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '20px';
    errorDiv.style.textAlign = 'center';
    errorDiv.textContent = `Failed to load game assets: ${error.message}`;
    document.body.appendChild(errorDiv);
  });
