import { MySystemManager } from './system-manager.js';

// For DEBUGGING
/*
import { ActionHandler   } from '../../token-action-hud-core/scripts/action-handlers/action-handler.js'
import { RollHandler     } from '../../token-action-hud-core/scripts/roll-handlers/roll-handler.js'
import { SystemManager   } from '../../token-action-hud-core/scripts/system-manager.js'
import { Utils           } from '../../token-action-hud-core/scripts/utilities/utils.js'
*/

Hooks.once('tokenActionHudCoreApiReady', async () => {
    const module = game.modules.get('fvtt-token-action-hud-TheWitcherTRPG');
    module.api = {
        requiredCoreModuleVersion: '1.4',
        SystemManager: MySystemManager
    };
    console.log('test');
    Hooks.call('tokenActionHudSystemReady', module);
});