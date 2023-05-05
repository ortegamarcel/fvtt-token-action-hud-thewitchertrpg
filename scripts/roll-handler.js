import { ACTION_TYPE } from "./constants.js";
import { Utils } from "./utils.js";

export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        doHandleActionEvent(event, encodedValue) {
            let payload = encodedValue.split(this.delimiter);

            if (payload.length != 4) {
                super.throwInvalidValueErr();
            }
        
            const action = payload[0];
            const actorId  = payload[1];
            const tokenId  = payload[2];
            const value = payload[3];

            const actor = Utils.getActor(actorId, tokenId);
                
            switch (action) {
                case ACTION_TYPE.attack:
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
});
