// src/js/entities/TransportationItem.js

import {
    add, text as addText, pos, anchor, color, fixed, z, lifespan, time, center, height, onUpdate, offUpdate, destroy
} from "../../context.js";
import { BaseItem } from "./BaseItem.js";
import { PLAYER_SPEED, mapWidth, mapHeight } from "../../config/constants.js";
import { context } from "../../context.js"; // Important!

export class TransportationItem extends BaseItem {
    constructor(config) {
        super(config.type, config.gameState, config.player);
        this.transportType = config.transportType; // 'subway', 'taxi', etc.
        this.speedMultiplier = config.speedMultiplier || 2;
    }

    transportPlayer(player, gameState) {
        switch (this.transportType) {
            case "subway":
                this.handleSubwayTransport(player, gameState);
                break;
            case "taxi":
                this.handleTaxiTransport(player, gameState);
                break;
        }
    }

    handleSubwayTransport(player, gameState) {
        let targetY;
        if (player.pos.y < mapHeight / 2) {
            targetY = mapHeight * 0.75;
        } else {
            targetY = mapHeight * 0.25;
        }

        const moveDist = Math.abs(player.pos.y - targetY);
        const moveTime = moveDist / (this.speedMultiplier * PLAYER_SPEED);
        const startY = player.pos.y;
        const startTime = time();

        onUpdate("subwayMove", () => {
            const t = Math.min((time() - startTime) / moveTime, 1);
            player.pos.y = startY + (targetY - startY) * t;

            if (t >= 1) {
                player.pos.y = targetY;
                offUpdate("subwayMove");
            }
        });

        this.showMessage("Next stop, fun!", [0, 255, 255]);
    }

    handleTaxiTransport(player, gameState) {
        if (context.devil) {
            destroy(context.devil);
            context.devil = null;
            // Optional: stop devil music if you have music control elsewhere
            if (context.darkMusic) {
                context.darkMusic.stop();
            }
        }

        this.showMessage("Escaped via taxi!", [0, 255, 255]);
    }

    showMessage(messageText, colorValue) {
        add([
            addText(messageText, { size: 24 }),
            pos(center().x, height() - 100),
            anchor("center"),
            color(colorValue[0], colorValue[1], colorValue[2]),
            fixed(),
            z(101),
            lifespan(2),
        ]);
    }
}
