import { SystemManager } from './system-manager.js'
import { MODULE, REQUIRED_CORE_MODULE_VERSION } from './constants.js'
import { registerSettings } from './settings.js';

async function preloadHandlebarsTemplates() {
    const templatePath = [
        `modules/${MODULE.ID}/templates/skill-settings-menu.hbs`
    ];
    return loadTemplates(templatePath);
}

Hooks.on('tokenActionHudCoreApiReady', async () => {
    const module = game.modules.get(MODULE.ID)
    module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager
    }

    preloadHandlebarsTemplates();
    registerSettings();
    Hooks.call('tokenActionHudSystemReady', module)
});