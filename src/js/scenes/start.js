// src/js/scenes/start.js

import {
    add, sprite, text, pos, scale, onKeyPress, onMousePress, go, width, height, center
} from "../context.js";
import { MUSIC_ENABLED } from "../config/constants.js";

export function startScene() {
    // Add background
    add([
        sprite("start_screen"),
        pos(0, 0),
        scale(1),
    ]);

    // Add title
    add([
        text("NYC Vibes", { size: 64, font: "Arial" }),
        pos(width() / 2, height() / 3),
        center(),
    ]);

    // Add start text
    add([
        text("Press SPACE or Click to Start", { size: 32, font: "Arial" }),
        pos(width() / 2, height() * 2 / 3),
        center(),
    ]);

    // Add music status
    add([
        text(`Music: ${MUSIC_ENABLED ? "ON" : "OFF"}`, { size: 24, font: "Arial" }),
        pos(width() / 2, height() * 3 / 4),
        center(),
    ]);

    // Start game on space or click
    onKeyPress("space", () => {
        go("game");
    });

    onMousePress(() => {
        go("game");
    });
}
