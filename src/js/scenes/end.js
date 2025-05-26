// src/js/scenes/end.js

import { add, sprite, pos, fixed, z, width, height, center, destroy, go, onMousePress, anchor, text, color } from "../context.js";
import { GameState } from "../utils/gameControl.js";

export function createEndScene() {
    return (isWin) => {
        // Centered end screen image
        const img = add([
            sprite(isWin ? "win_screen" : "lose_screen"),
            pos(width() / 2, height() / 2 - 100),
            anchor("center"),
            z(10),
        ]);

        // Centered Play Again button
        const playAgainBtn = add([
            text("Play Again", { size: 36, font: "Arial" }),
            pos(width() / 2, height() / 2 + 180),
            anchor("center"),
            color(30, 80, 150),
            z(20),
            "playAgainBtn"
        ]);

        // Make button clickable
        playAgainBtn.onMousePress(() => {
            // Reset game state by creating a new instance
            window.gameState = new GameState();
            go("start");
        });

        // Return cleanup function
        return {
            cleanup() {
                destroy(img);
                destroy(playAgainBtn);
            }
        };
    };
}
