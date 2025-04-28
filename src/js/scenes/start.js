export function createStartScene() {
    return () => {
        let startScreen;
        let cleanupFunctions = [];

        // Create start screen background, ensure it's centered and fits the viewport
        startScreen = add([
            sprite("start", { width: width(), height: height() }),
            pos(center()),
            anchor("center"),
            scale(Math.min(width() / 1024, height() / 768)), // scale to fit if needed
            fixed(),
            z(0),
            // Uncomment for debug: outline(4, rgb(255,0,0))
        ]);

        // Add click handler
        const clickHandler = onMousePress(() => {
            go("game");
        });
        cleanupFunctions.push(() => clickHandler.cancel());

        // Add key handler
        const keyHandler = onKeyPress("space", () => {
            go("game");
        });
        cleanupFunctions.push(() => keyHandler.cancel());

        // Return cleanup function
        return {
            cleanup() {
                // Clean up all event listeners
                cleanupFunctions.forEach(cleanup => cleanup());
                cleanupFunctions = [];

                // Remove all game objects
                if (startScreen) startScreen.destroy();
            }
        };
    };
} 