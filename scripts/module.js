// FOR LIVE
import { ActionHandler, DELIMITER, RollHandler, SystemManager, Utils } from '../../token-action-hud-core/scripts/token-action-hud-core.min.js'

// For DEBUGGING
/*
import { ActionHandler   } from '../../token-action-hud-core/scripts/action-handlers/action-handler.js'
import { RollHandler     } from '../../token-action-hud-core/scripts/roll-handlers/roll-handler.js'
import { SystemManager   } from '../../token-action-hud-core/scripts/system-manager.js'
import { Utils           } from '../../token-action-hud-core/scripts/utilities/utils.js'
*/

const COMBAT_ID = 'combat';
const WEAPONS_ID = 'weapons';

const ACTION_ATTACK = 'attack';

/* ACTIONS */

class MyActionHandler extends ActionHandler {

    /** @override */
    async buildSystemActions(subcategoryIds) {
        // We don't support MULTIPLE tokens being selected at the same time.
        //this.actors = (!this.actor) ? this._getActors() : [this.actor]
        //this.tokens = (!this.token) ? this._getTokens() : [this.token]
        //this.actorType = this.actor?.type

        const token = this.token;
        const actor = this.actor;
        if (!token || !actor) {
            return;
        }

        this._getCombat(actor, token.id, { id: COMBAT_ID, type: 'system' });

      
        //if (settings.get("showHudTitle")) result.hudTitle = token.name;
    }

    _getCombat(actor, tokenId, parent) {
        // just one long list of actions for the combat category
        const actions = actor.items
            .filter(item => item.type === 'weapon' && item.system.equiped)
            .map(item => ({
                id: item.id,
                name: item.name,
                encodedValue: [ACTION_ATTACK, actor.id, tokenId, item.id].join(DELIMITER),
                img: Utils.getImage(item)
            }));
        this.addActions(actions, parent);
    }

    // createList(parent, actor, tokenId, itemtype, checksort, sorting, label, selectedfunc=undefined) {
    //     // create one sublist
    //     const actions = actor.items.filter( item => item.type === itemtype && 
    //         (!checksort || item.system.settings.general.sorting === sorting) &&
    //         (!actor.system.settings.general.hideArchive || !item.system.archived))
    //         .map(item => {
    //         return {
    //             id: item.id,
    //             name: item.name,
    //             encodedValue: [itemtype, actor.id, tokenId, item.id].join(this.delimiter),
    //             cssClass: item.system.archived ? 'disabled' : selectedfunc ? (selectedfunc(item) ? 'toggle active' : 'toggle') : '',
    //             img: Utils.getImage(item)
    //         }
    //     })
    //     if (actions.length) {
    //         const subcat = { id: sorting, name: Utils.i18n(label), type: 'system-derived'};
    //         this.addGroup(subcat, parent);
    //         this.addActions(actions, subcat);
    //     }
    // }

    // _getSkills(actor, tokenId, parent) {
    //     // up to four groups of skills
    //     const table = {
    //         Skill:      actor.system.settings.skills.labelCategory1 || 'CYPHERSYSTEM.Skills',
    //         SkillTwo:   actor.system.settings.skills.labelCategory2 || 'CYPHERSYSTEM.SkillCategoryTwo',
    //         SkillThree: actor.system.settings.skills.labelCategory3 || 'CYPHERSYSTEM.SkillCategoryThree',
    //         SkillFour:  actor.system.settings.skills.labelCategory4 || 'CYPHERSYSTEM.SkillCategoryFour',
    //     }
    //     for (const [ sorting, label ] of Object.entries(table)) {
    //         this.createList(parent, actor, tokenId, ACTION_SKILL, true, sorting, label)
    //     }
    // }

    // _getAbilities(actor, tokenId, parent) {
    //     // up to four groups of abilities
    //     const table = {
    //         Ability:      actor.system.settings.abilities.labelCategory1 || 'CYPHERSYSTEM.Abilities',
    //         AbilityTwo:   actor.system.settings.abilities.labelCategory2 || 'CYPHERSYSTEM.AbilityCategoryTwo',
    //         AbilityThree: actor.system.settings.abilities.labelCategory3 || 'CYPHERSYSTEM.AbilityCategoryThree',
    //         AbilityFour:  actor.system.settings.abilities.labelCategory4 || 'CYPHERSYSTEM.AbilityCategoryFour',
    //         Spell:        'CYPHERSYSTEM.Spells'
    //     }
    //     for (const [ sorting, label ] of Object.entries(table)) {
    //         this.createList(parent, actor, tokenId, ACTION_ABILITY, true, sorting, label);
    //     }
    // }

    // _getTags(actor, tokenId, parent) {
    //     // current recursion is from actor.getFlag("cyphersystem", "recursion"), but the stored string is @<lowercasenanme>
    //     const recursion = actor.getFlag("cyphersystem", "recursion")?.slice(1); // strip leading '@'
    //     const recursionname = actor.items.find(item => item.name.toLowerCase() === recursion)?.name;
    //     this.createList(parent, actor, tokenId, ACTION_RECURSION, false, 'recursion', 'CYPHERSYSTEM.Recursions', 
    //         (item) => item.name == recursionname );
    //     this.createList(parent, actor, tokenId, ACTION_TAG, false, 'tag', 'CYPHERSYSTEM.Tags',
    //         (item) => item.system.active );
    // }
}


/* ROLL HANDLER */

class MyRollHandler extends RollHandler {

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
            case ACTION_ATTACK:
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

// Core Module Imports

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
        const COMBAT_NAME = 'Kampf'; // game.i18n.localize('TAH_WITCHER.Combat');
        const WEAPONS_NAME = 'Waffen';
        
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
                            id: WEAPONS_NAME,
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

/* STARTING POINT */

Hooks.once('tokenActionHudCoreApiReady', async () => {
    const module = game.modules.get('fvtt-token-action-hud-TheWitcherTRPG');
    module.api = {
        requiredCoreModuleVersion: '1.4',
        SystemManager: MySystemManager
    };
    console.log('test');
    Hooks.call('tokenActionHudSystemReady', module);
});