// src/js/context.js

import kaboom from "https://unpkg.com/kaboom@3000/dist/kaboom.mjs";

// Initialize Kaboom with global functions disabled
export const k = kaboom({
    width: 1024,
    height: 768,
    background: [0, 0, 0],
    global: false,
});

// Destructure and export necessary functions, including 'dt'
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
    width,
    height,
    camPos,
    center,
    go,
    rand,
    lifespan,
    dt, // Added 'dt' to exports
} = k;

// Shared game state object
export const context = {
    player: null,
    devil: null,
    devilSpawnTimer: null,
    devilPermanentlyDead: false,
    explosionDuration: 0.5,
};
