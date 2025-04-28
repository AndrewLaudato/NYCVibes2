import kaboom from 'https://unpkg.com/kaboom@3000.0.0/dist/kaboom.mjs';

const k = kaboom({
    width: 1024,
    height: 768,
    background: [0, 0, 0],
    global: true,
    debug: true
});

export const { add, sprite, text, pos, anchor, color, fixed, z, rect, area, onKeyDown, onUpdate, camPos, play, width, height, center, rgb, opacity, lifespan, time, wait, circle, scale, destroy, go, onMousePress, offUpdate, loadSprite, loadSound, scene } = k; 