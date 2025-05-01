// src/js/scenes/end.js

import { add, sprite, pos, fixed, z, width, height, center, destroy, go, onMousePress } from "../context.js";

export function createEndScene() {
    return (isWin) => {
        // End screen background
        const endScreen = add([
            sprite(isWin ? "win_screen" : "lose_screen"),
            pos(0, 0),
            fixed(),
            z(0),
        ]);

        // Restart game on click
        const unbind = onMousePress(() => {
            go("start");
        });

        // Return cleanup function
        return {
            cleanup() {
                destroy(endScreen);
                unbind(); // Cleanly remove mouse listener
            }
        };
    };
}
