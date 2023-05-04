import { SystemManager } from "../../token-action-hud-core/scripts/token-action-hud-core.min.js";
import { MyActionHandler } from "./action-handler.js";
import { COMBAT_ID, WEAPONS_ID } from "./constants.js";
import { MyRollHandler } from "./roll-handler.js";

export class MySystemManager extends SystemManager {
    /** @override */
    doGetActionHandler(categoryManager) {
        return new MyActionHandler(categoryManager);
    }

    /** @override */
    getAvailableRollHandlers() {
        const choices = { core: "Core The Witcher TRPG" };
        return choices;
    }

    /** @override */
    doGetRollHandler(handlerId) {
        return new MyRollHandler();
    }

    /** @override */
    /*doRegisterSettings(updateFunc) {
        systemSettings.register(updateFunc)
    }*/

    async doRegisterDefaultFlags() {
        const COMBAT_NAME = game.i18n.localize('TAH_WITCHER.Combat');
        const WEAPONS_NAME = game.i18n.localize('TAH_WITCHER.Weapons');
        
        const DEFAULTS = {
            layout: [
                {
                    nestId: COMBAT_ID,
                    id: COMBAT_ID,
                    name: COMBAT_NAME,
                    type: 'system',
                    groups: [
                        {
                            nestId: 'combat_weapons',
                            id: WEAPONS_ID,
                            name: WEAPONS_NAME,
                            type: 'system'
                        }
                    ]
                }
            ],
            groups: [
                { id: COMBAT_ID, name: COMBAT_NAME, type: 'system' }
            ]
        };

        // HUD CORE v1.2 wants us to return the DEFAULTS
        return DEFAULTS;
    }
}