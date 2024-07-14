import { ActionHandler } from "./action-handler.js";
import { RollHandler } from "./roll-handler.js";
import { DEFAULTS } from "./defaults.js";

export let SystemManager = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    SystemManager = class SystemManager extends coreModule.api.SystemManager {
        /** @override */
        doGetCategoryManager() {
            return new coreModule.api.CategoryManager()
        }
        
        /** @override */
        getActionHandler(categoryManager) {
            return new ActionHandler(categoryManager);
        }

        /** @override */
        getAvailableRollHandlers() {
            const choices = { core: "Core The Witcher TRPG" };
            // coreModule.api.SystemManager.addHandler(choices, 'TheWitcherTRPG')
            return choices;
        }

        /** @override */
        getRollHandler(handlerId) {
            return new RollHandler();
        }

        /** @override */
        /*registerSettings(updateFunc) {
            systemSettings.register(updateFunc)
        }*/

        /** @override */
        async registerDefaults() {
            const defaults = DEFAULTS;
            return defaults;
        }
    }
});