import { ACTION_TYPE, GROUP, ICON, SKILL } from "./constants.js";
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
            if (!token || !actor || actor.type == 'loot') {
                return;
            }

            this._getAttacks(actor, token.id, { id: GROUP.attack.id, type: 'system' });
            this._getDefense(actor, token.id, { id: GROUP.defense.id, type: 'system' });
            if (Utils.getSetting('showSkillCategories')) {
                this._getSkills(SKILL.int, actor, token.id, { id: GROUP.intSkills.id, type: 'system' });
                this._getSkills(SKILL.ref, actor, token.id, { id: GROUP.refSkills.id, type: 'system' });
                this._getSkills(SKILL.dex, actor, token.id, { id: GROUP.dexSkills.id, type: 'system' });
                this._getSkills(SKILL.body, actor, token.id, { id: GROUP.bodySkills.id, type: 'system' });
                this._getSkills(SKILL.emp, actor, token.id, { id: GROUP.empSkills.id, type: 'system' });
                this._getSkills(SKILL.cra, actor, token.id, { id: GROUP.craSkills.id, type: 'system' });
                this._getSkills(SKILL.will, actor, token.id, { id: GROUP.willSkills.id, type: 'system' });
            } else {
                this._getSkills({
                    ...SKILL.int,
                    ...SKILL.ref,
                    ...SKILL.dex,
                    ...SKILL.body,
                    ...SKILL.emp,
                    ...SKILL.cra,
                    ...SKILL.will
                }, actor, token.id, { id: GROUP.allSkills.id, type: 'system' });
            }

            
            //if (settings.get("showHudTitle")) result.hudTitle = token.name;
        }

        _getAttacks(actor, tokenId, parent) {
            const isMonster = actor.type == 'monster';
            const hasAmmo = actor.items.some(item => item.type == 'weapon' && item.system.isAmmo && item.system.quantity > 0);
            const actions = actor.items
                .filter(item => {
                    const isWeapon = item.type == 'weapon';
                    const isReliable = item.system.reliable > 0;
                    const isEquipped = item.system.equiped;
                    const isAvailable = item.system.quantity > 0;
                    const isAmmo = item.system.isAmmo;
                    const usesAmmo = item.system.usingAmmo;

                    return isWeapon && isReliable && isAvailable && (isMonster || isEquipped) && !isAmmo && (!usesAmmo || hasAmmo);
                })
                .map(item => ({
                    id: item.id,
                    name: item.name,
                    encodedValue: [ACTION_TYPE.attack, actor.id, tokenId, item.id].join(this.delimiter),
                    img: Utils.getImage(item)
                }));
            this.addActions(actions, parent);
        }

        _getDefense(actor, tokenId, parent) {
            const action = {
                id: `defense_${tokenId}`,
                name: Utils.i18n('WITCHER.Dialog.DefenseTitle'),
                encodedValue: [ACTION_TYPE.defense, actor.id, tokenId].join(this.delimiter),
                icon1: ICON.defense
            };
            this.addActions([action], parent);
        }

        _getSkills(skillSet, actor, tokenId, parent) {
            let actions = Object.entries(skillSet)
                .filter(([id, skill]) => skill.active)
                .map(([id, skill]) => {
                    const encodedValue = [ACTION_TYPE.skill, actor.id, tokenId, skill.statNum, skill.skillNum].join(this.delimiter);
                    let name = Utils.i18n(skill.name).split('(')[0].trim();
                    
                    // Add suffix according on settings
                    const showSuffix = Utils.getSetting('showSkillSuffix');
                    if (showSuffix != 'never') {
                        const actorSkill = actor.system.skills[skill.stat][id];
                        let skillpoints = actorSkill.value;
                        actorSkill.modifiers.forEach(({ value }) => skillpoints += Number(value));
                        if (showSuffix == 'always' || skillpoints > 0) {
                            let statValue = 0;
                            if (Utils.getSetting('skillSuffix') == 'basevalue') {
                                statValue = actor.system.stats[skill.stat].current
                            }
                            name += ` ${skillpoints + statValue}`;
                        }
                    }

                    return { id, name, encodedValue };
                });

            if (Utils.getSetting('sortSkillsAlphabetically')) {
                actions = actions.sort((action1, action2) => action1.name.localeCompare(action2.name));
            }

            this.addActions(actions, parent);
        }
    }
});