import { ACTION_TYPE } from "./constants.js";
import { Utils } from "./utils.js";

export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        doHandleActionEvent(event, encodedValue) {
            let payload = encodedValue.split(this.delimiter);

            if (payload.length < 3) {
                super.throwInvalidValueErr();
            }
        
            const action = payload[0];
            const actorId  = payload[1];
            const tokenId  = payload[2];
            const args = payload.slice(3);

            const actor = Utils.getActor(actorId, tokenId);
                
            switch (action) {
                case ACTION_TYPE.attack:
                    const itemId = args[0];
                    actor.sheet._onItemRoll.call(actor.sheet, null, itemId);
                    break;
                case ACTION_TYPE.defense:
                    actor.sheet._onDefenceRoll.call(actor.sheet);
                    break;
                case ACTION_TYPE.skill:
                    const statNum = Number(args[0]);
                    const skillNum = Number(args[1]);
                    actor.sheet._onSkillRoll.call(actor.sheet, statNum, skillNum);
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
