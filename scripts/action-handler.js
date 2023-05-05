import { ACTION_TYPE, GROUP } from "./constants.js";
import { Utils } from "./utils.js";

export let ActionHandler = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {

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

            this._getCombat(actor, token.id, { id: GROUP.weapons.id, type: 'system' });

            
            //if (settings.get("showHudTitle")) result.hudTitle = token.name;
        }

        _getCombat(actor, tokenId, parent) {
            // just one long list of actions for the combat category
            const actions = actor.items
                .filter(item => item.type === 'weapon' && item.system.equiped)
                .map(item => ({
                    id: item.id,
                    name: item.name,
                    encodedValue: [ACTION_TYPE.attack, actor.id, tokenId, item.id].join(this.delimiter),
                    img: Utils.getImage(item)
                }));
            console.log('actions :>> ', actions);
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
});