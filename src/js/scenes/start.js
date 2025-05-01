// src/js/scenes/start.js

import {
    add, sprite, pos, anchor, scale, fixed, z, width, height, center, onMousePress, onKeyPress, go
} from "../context.js";

export function createStartScene() {
    return () => {
        let startScreen;
        let cleanupFunctions = [];

        // Create start screen background, centered and scaled
        startScreen = add([
            sprite("start", { width: width(), height: height() }),
            pos(center()),
            anchor("center"),
            scale(Math.min(width() / 1024, height() / 768)), // Scale to fit screen
            fixed(),
            z(0),
        ]);

        // Mouse click handler -> start game
        const clickHandler = onMousePress(() => {
            go("city");
        });
        cleanupFunctions.push(() => clickHandler.cancel());

        // Spacebar key handler -> start game
        const keyHandler = onKeyPress("space", () => {
            go("city");
        });
        cleanupFunctions.push(() => keyHandler.cancel());

        // Return cleanup function
        return {
            cleanup() {
                cleanupFunctions.forEach((fn) => fn());
                cleanupFunctions = [];

                if (startScreen) {
                    startScreen.destroy();
                    startScreen = null;
                }
            }
        };
    };
}
