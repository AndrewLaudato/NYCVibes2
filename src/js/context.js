// src/js/context.js

import kaboom from "https://unpkg.com/kaboom@3000/dist/kaboom.mjs";

// Initialize Kaboom with global functions disabled
export const k = kaboom({
    width: 1024,
    height: 768,
    background: [0, 0, 0],
    global: false,
    debug: true, // Enable debug mode to see any errors
    clearColor: [0, 0, 0, 1],
    scale: 1,
    crisp: true,
    canvas: document.getElementById("game"),
    font: "Arial",
    root: document.body,
});

// Destructure and export necessary functions
export const {
    add,
    sprite,
    area,
    body,
    move,
    destroy,
    pos,
    scale,
    z,
    scene,
    onUpdate,
    collides,
    play,
    loadSprite,
    loadSound,
    text,
    anchor,
    color,
    fixed,
    rect,
    onKeyDown,
    onKeyPress,
    onMousePress,
    isKeyDown,
    vec2,
    width,
    height,
    camPos,
    center,
    go,
    rand,
    lifespan,
    dt,
    time,
    rgb,
    wait,
} = k;

// Shared game state object
export const context = {
    player: null,
    devil: null,
    devilSpawnTimer: null,
    devilPermanentlyDead: false,
    explosionDuration: 0.5,
    darkMusic: null,
};
