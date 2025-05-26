// src/js/scenes/start.js

import {
    add, sprite, text, pos, scale, onKeyPress, onMousePress, go, width, height, center, color, z, rect, anchor, rgb
} from "../context.js";
import { MUSIC_ENABLED } from "../config/constants.js";

export function startScene() {
    // Panel dimensions
    const panelWidth = 800;
    const panelHeight = 420;
    const panelX = width() / 2 - panelWidth / 2;  // Center the panel horizontally
    const panelY = height() / 2 - panelHeight / 2; // Center the panel vertically

    // White panel for text and controls
    add([
        rect(panelWidth, panelHeight, { radius: 24 }),
        pos(panelX, panelY),
        color(255, 255, 255),
        z(10),
    ]);

    // Game title
    add([
        text("NYC Vibe Quest", { size: 48, font: "Arial" }),
        pos(panelX + panelWidth / 2, panelY + 40),
        anchor("center"),
        color(30, 80, 150),
        z(11),
    ]);

    // Instructions
    add([
        text("Use the arrow keys to move\nCollect 50 Vibes to win, but watch out!\nPress M at any time to toggle music ON/OFF. Music starts OFF.", { size: 28, font: "Arial" }),
        pos(panelX + panelWidth / 2, panelY + 110),
        anchor("center"),
        color(0, 0, 0),
        z(11),
    ]);

    // Play button (centered at bottom of panel, with extra gap)
    const playBtn = add([
        text("Play", { size: 48, font: "Arial" }),
        pos(panelX + panelWidth / 2, panelY + panelHeight - 40),
        anchor("center"),
        color(30, 80, 150),
        z(30),
        "playBtn"
    ]);
    playBtn.onMousePress(() => {
        go("game");
    });

    // Player image on the right (move left and reduce size)
    add([
        sprite("player", { width: 220, height: 220 }),
        pos(panelX + panelWidth - 140, panelY + 40),
        z(10),
    ]);
}
