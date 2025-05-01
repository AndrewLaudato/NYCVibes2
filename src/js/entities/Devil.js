// src/js/entities/Devil.js

import { add, sprite, area, body, move, destroy, pos, scale, z, play, loadSprite, width, height, rand } from "../context.js";
import { context } from "../context.js";
import { DEVIL_SPAWN_CHANCE, DEVIL_INITIAL_DELAY } from "../config/constants.js";

let explosionSpriteLoaded = false;

function loadExplosionSprite() {
    if (!explosionSpriteLoaded) {
        loadSprite("explosion", "static/explosion.png");
        explosionSpriteLoaded = true;
    }
}

export function spawnDevil() {
    if (context.devilPermanentlyDead || context.devil) {
        return; // Already dead or already active
    }

    if (Math.random() < DEVIL_SPAWN_CHANCE) {
        console.log("Devil spawned!");

        context.devil = add([
            sprite("devil"),
            pos(rand(0, width()), rand(0, height())),
            area(),
            body(),
            scale(1.2),
            "devil",
            z(10),
        ]);

        play("dark", { loop: true });
    } else {
        console.log("Devil spawn chance failed. Will retry later.");
        scheduleDevilSpawn();
    }
}

export function scheduleDevilSpawn() {
    if (context.devilPermanentlyDead || context.devilSpawnTimer) {
        return;
    }

    context.devilSpawnTimer = setTimeout(() => {
        spawnDevil();
    }, DEVIL_INITIAL_DELAY);
}

export function destroyDevil(permanently = false) {
    if (context.devil) {
        destroy(context.devil);
        context.devil = null;
    }

    play("background", { loop: true });

    if (permanently) {
        context.devilPermanentlyDead = true;
        if (context.devilSpawnTimer) {
            clearTimeout(context.devilSpawnTimer);
            context.devilSpawnTimer = null;
        }
    } else {
        scheduleDevilSpawn();
    }
}

export function triggerExplosion(atPos) {
    loadExplosionSprite();

    const explosion = add([
        sprite("explosion"),
        pos(atPos),
        scale(1),
        z(20),
    ]);

    play("boom");

    wait(context.explosionDuration, () => {
        destroy(explosion);
    });
}
