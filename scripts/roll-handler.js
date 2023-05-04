import { DELIMITER, RollHandler, Utils } from "../../token-action-hud-core/scripts/token-action-hud-core.min.js";
import { ACTIONS } from "./constants.js";

export class MyRollHandler extends RollHandler {
    doHandleActionEvent(event, encodedValue) {
        let payload = encodedValue.split(DELIMITER);

        if (payload.length != 4) {
            super.throwInvalidValueErr();
        }
    
        const action = payload[0];
        const actorId  = payload[1];
        const tokenId  = payload[2];
        const value = payload[3];

        const actor = Utils.getActor(actorId, tokenId);
            
        switch (action) {
            case ACTIONS.ATTACK:
                actor.sheet._onItemRoll.call(actor.sheet, null, value);
                break;
            default:
                console.warn(`token-action-hud-TheWitcherTRPG: Unknown action "${action}"`);
                break;
        }

        // Ensure the HUD reflects the new conditions
        // Hooks.callAll('forceUpdateTokenActionHud');
    }
}