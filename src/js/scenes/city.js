// src/js/scenes/city.js

import {
    scene,
    onUpdate,
    onKeyDown,
    add,
    sprite,
    pos,
    fixed,
    z,
    center,
    isKeyDown,
    vec2,
    dt,
    width,
    height,
} from "../context.js";
import { context } from "../context.js";
import {
    spawnDevil,
    destroyDevil,
    scheduleDevilSpawn,
    triggerExplosion,
} from "../entities/Devil.js";
import { Player } from "../entities/Player.js";
import { PLAYER_SPEED } from "../config/constants.js";

export function createMainScene() {
    return () => {
        // Initialize player
        const playerEntity = new Player(context.gameState);
        const player = playerEntity.spawn();

        // Register player in context
        context.player = player;

        // Spawn devil after initial delay
        scheduleDevilSpawn();

        // Player movement
        onUpdate(() => {
            if (context.player) {
                let direction = vec2(0, 0);
                if (isKeyDown("left")) direction.x -= 1;
                if (isKeyDown("right")) direction.x += 1;
                if (isKeyDown("up")) direction.y -= 1;
                if (isKeyDown("down")) direction.y += 1;

                // Move the player, scaling by dt() for frame-rate independence
                context.player.move(direction.scale(PLAYER_SPEED * dt()));
            }
        });

        // Devil movement
        onUpdate(() => {
            if (context.devil && context.player) {
                const dir = context.player.pos.sub(context.devil.pos).unit();
                context.devil.move(dir.scale(DEVIL_SPEED * dt()));
            }
        });

        // Attach player collision detection once
        onUpdate(() => {
            if (context.player && !context.player._hasDevilCollision) {
                context.player.onCollide("devil", (devil) => {
                    console.log("Player hit by devil!");

                    // Always trigger explosion and destroy for now
                    triggerExplosion(devil.pos);
                    destroyDevil(true);
                });

                // Mark player so we don't attach multiple listeners
                context.player._hasDevilCollision = true;
            }
        });
    };
}
