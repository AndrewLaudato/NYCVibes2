import kaboom from 'https://unpkg.com/kaboom@3000.0.0/dist/kaboom.mjs';
const { add, text, pos, anchor, color, fixed, z, lifespan, time, center, height, onUpdate, offUpdate } = kaboom;
import { BaseItem } from './BaseItem.js';
import { PLAYER_SPEED, mapWidth, mapHeight } from '../../config/constants.js';

export class TransportationItem extends BaseItem {
    constructor(config) {
        super(config);
        this.transportType = config.transportType; // 'subway', 'taxi', etc.
        this.speedMultiplier = config.speedMultiplier || 2;
    }

    transportPlayer(player, gameState) {
        switch(this.transportType) {
            case 'subway':
                this.handleSubwayTransport(player, gameState);
                break;
            case 'taxi':
                this.handleTaxiTransport(player, gameState);
                break;
        }
    }

    handleSubwayTransport(player, gameState) {
        // Move player vertically to opposite quarter
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
        // Remove devil if present
        if (gameState.devil) {
            destroy(gameState.devil);
            gameState.devil = null;
            if (gameState.devilMusic) gameState.devilMusic.stop();
        }

        this.showMessage("Escaped via taxi!", [0, 255, 255]);
    }

    showMessage(text, color) {
        add([
            text(text, { size: 24 }),
            pos(center().x, height() - 100),
            anchor("center"),
            color(color[0], color[1], color[2]),
            fixed(),
            z(101),
            lifespan(2),
        ]);
    }
} 