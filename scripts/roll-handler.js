import { ACTION_TYPE, MODULE } from "./constants.js";
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
            let itemId;
                
            switch (action) {
                case ACTION_TYPE.attack:
                    itemId = args[0];
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
                case ACTION_TYPE.castMagic:
                    itemId = args[0];
                    // right click
                    if (event.which == 3) {
                        this._showDescription(actor, itemId, () => {
                            actor.sheet._onSpellRoll.call(actor.sheet, null, itemId);
                        });
                    } else {
                        actor.sheet._onSpellRoll.call(actor.sheet, null, itemId);
                    }
                    break;
                default:
                    console.warn(`${MODULE.ID}: Unknown action "${action}"`);
                    break;
            }

            // Ensure the HUD reflects the new conditions
            // Hooks.callAll('forceUpdateTokenActionHud');
        }

        /** Shows the description or effect of an item. */
        async _showDescription(actor, itemId, rollFn) {
            const item = actor.items.get(itemId);
            if (!item) {
                return;
            }
            
            let buttons = {};
            if (rollFn) {
                buttons = {
                    roll: {
                        label: Utils.i18n('WITCHER.Dialog.ButtonRoll'),
                        callback: rollFn
                    },
                    cancel: {
                        label: Utils.i18n('WITCHER.Button.Cancel'),
                        callback: () => {}
                    }
                };
            }

            return new Dialog({
                title: item.name,
                content: `<p>${item.system.description || item.system.effect}</p>`,
                buttons
            }).render(true);
        }
    }
});
