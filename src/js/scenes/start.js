export function createStartScene() {
    return () => {
        let startScreen;
        let cleanupFunctions = [];

        // Create start screen background
        startScreen = add([
            sprite("start"),
            pos(center()),
            anchor("center"),
            scale(1),
            fixed(),
            z(0)
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