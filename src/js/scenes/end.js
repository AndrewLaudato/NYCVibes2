import kaboom from 'https://unpkg.com/kaboom@3000.0.0/dist/kaboom.mjs';
const { add, sprite, text, pos, anchor, color, fixed, z, area, width, height, center } = kaboom;

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
        onMousePress(() => {
            go("start");
        });

        // Return cleanup function
        return {
            cleanup() {
                destroy(endScreen);
            }
        };
    };
} 