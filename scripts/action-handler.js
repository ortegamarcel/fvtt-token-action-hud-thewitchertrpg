import { ACTION_TYPE, GROUP, ICON } from "./constants.js";
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

            const skillSettings = Utils.getSetting('skillSettings');
            const token = this.token;
            const actor = this.actor;
            if (!token || !actor || (actor.type != 'character' && actor.type != 'monster')) {
                return;
            }

            this._getAttacks(actor, token.id, { id: GROUP.attack.id, type: 'system' });
            this._getDefense(actor, token.id, { id: GROUP.defense.id, type: 'system' });
            this._getSpecialActions(actor, token.id, { id: GROUP.specialActions.id, type: 'system' });
            if (Utils.getSetting('showSkillCategories')) {
                this._getSkills(skillSettings.int, actor, token.id, { id: GROUP.intSkills.id, type: 'system' });
                this._getSkills(skillSettings.ref, actor, token.id, { id: GROUP.refSkills.id, type: 'system' });
                this._getSkills(skillSettings.dex, actor, token.id, { id: GROUP.dexSkills.id, type: 'system' });
                this._getSkills(skillSettings.body, actor, token.id, { id: GROUP.bodySkills.id, type: 'system' });
                this._getSkills(skillSettings.emp, actor, token.id, { id: GROUP.empSkills.id, type: 'system' });
                this._getSkills(skillSettings.cra, actor, token.id, { id: GROUP.craSkills.id, type: 'system' });
                this._getSkills(skillSettings.will, actor, token.id, { id: GROUP.willSkills.id, type: 'system' });
            } else {
                this._getSkills({
                    ...skillSettings.int,
                    ...skillSettings.ref,
                    ...skillSettings.dex,
                    ...skillSettings.body,
                    ...skillSettings.emp,
                    ...skillSettings.cra,
                    ...skillSettings.will
                }, actor, token.id, { id: GROUP.allSkills.id, type: 'system' });
            }
            this._getProfessionSkills(actor, token.id, { id: GROUP.professionSkills.id, type: 'system' });
            this._getMagic('Spells', actor, token.id, { id: GROUP.spells.id, type: 'system' });
            this._getMagic('Invocations', actor, token.id, { id: GROUP.invocations.id, type: 'system' });
            this._getMagic('Witcher', actor, token.id, { id: GROUP.signs.id, type: 'system' });
            this._getMagic('Rituals', actor, token.id, { id: GROUP.rituals.id, type: 'system' });
            this._getMagic('Hexes', actor, token.id, { id: GROUP.hexes.id, type: 'system' });
            this._getItem('valuable', 'alchemical-item', actor, token.id, { id: GROUP.alchemicalItems.id, type: 'system' });
            this._getItem('alchemical', 'oil', actor, token.id, { id: GROUP.oils.id, type: 'system' });
            this._getItem('alchemical', 'potion', actor, token.id, { id: GROUP.potions.id, type: 'system' });
            this._getItem('alchemical', 'decoction', actor, token.id, { id: GROUP.decoctions.id, type: 'system' });

            
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

        _getSpecialActions(actor, tokenId, parent) {
            const initiative = {
                id: 'initiative',
                name: Utils.i18n('WITCHER.Actor.Initiative'),
                encodedValue: [ACTION_TYPE.initiative, actor.id, tokenId].join(this.delimiter)
            };
            const save = {
                id: 'save',
                name: Utils.i18n('WITCHER.Actor.SavingThrow'),
                encodedValue: [ACTION_TYPE.save, actor.id, tokenId].join(this.delimiter)
            };
            const critOrFumble = {
                id: 'critorfumble',
                name: Utils.i18n('WITCHER.Actor.Crit/Fumble'),
                encodedValue: [ACTION_TYPE.critOrFumble, actor.id, tokenId].join(this.delimiter)
            };
            const recover = {
                id: 'recover',
                name: Utils.i18n('TAH_WITCHER.recover'),
                encodedValue: [ACTION_TYPE.recover, actor.id, tokenId].join(this.delimiter)
            };
            const actions = [initiative, save, critOrFumble, recover]
                .sort((a1, a2) => a1.name.localeCompare(a2.name));
            this.addActions(actions, parent);
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
                                statValue = actor.system.stats[skill.stat].current;
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

        _getProfessionSkills(actor, tokenId, parent) {
            const profession = actor.items.find(item => item.type == 'profession');
            if (!profession) {
                console.log('TAH_WITCHER: No profession');
                return;
            }
            const professionSkills = Utils.getAllProfessionSkills(profession);
            if (!professionSkills) {
                console.log('TAH_WITCHER: No profession skills');
                return;
            }
            const actions = professionSkills
                .filter(({ level }) => level != null)
                .map((skill, index) => {
                    let name = skill.skillName.toCapitalCase();

                    // Add suffix according on settings
                    const showSuffix = Utils.getSetting('showSkillSuffix');
                    if (showSuffix != 'never') {
                        const skillpoints = Number(skill.level);
                        if (showSuffix == 'always' || skillpoints > 0) {
                            if (Utils.getSetting('skillSuffix') == 'basevalue') {
                                if (skill.stat != 'none') {
                                    const statValue = actor.system.stats[skill.stat].current;
                                    name += ` ${skillpoints + statValue}`;
                                }
                            } else {
                                name += ` ${skillpoints}`;
                            }
                        }
                    }

                    return {
                        id: `profession_skill_${index}`,
                        name,
                        encodedValue: [ACTION_TYPE.professionSkill, actor.id, tokenId, skill.skillName].join(this.delimiter)
                    }
                });
            this.addActions(actions, parent);
        }

        _getMagic(type, actor, tokenId, parent) {
            const actions = actor.items
                .filter(item => item.type == 'spell' && item.system.class == type)
                .map(item => {
                    let name = item.name;
                    const showCost = Utils.getSetting('showMagicStaCost');
                    if (showCost) {
                        if (item.system.staminaIsVar) {
                            const varCostLabel = Utils.getSetting('magicVarStaCostLabel');
                            if (varCostLabel) {
                                name += ` (${Utils.getSetting('magicVarStaCostLabel')})`;
                            }
                        } else {
                            name += ` (${item.system.stamina})`;
                        }
                    }
                    return {
                        id: item.id,
                        name,
                        img: Utils.getImage(item),
                        encodedValue: [ACTION_TYPE.castMagic, actor.id, tokenId, item.id].join(this.delimiter)
                    }
                });
            this.addActions(actions, parent);
        }

        _getItem(type, subType, actor, tokenId, parent) {
            const actions = actor.items
                .filter(item => item.type == type && item.system.type == subType && item.system.quantity >= 1)
                .map(item => ({
                    id: item.id,
                    name: `${item.name} ${item.system.quantity}`,
                    img: Utils.getImage(item),
                    encodedValue: [ACTION_TYPE.consume, actor.id, tokenId, item.id].join(this.delimiter)
                }));
            this.addActions(actions, parent);
        }
    }
});