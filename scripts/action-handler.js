import { ACTION_TYPE, GROUP, ICON } from "./constants.js";
import { FilterFn, ItemFilterOptions } from "./types.js";
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

            // Combat
            this._getAttacks(actor, token.id, { id: GROUP.attack.id, type: 'system' });
            this._getDefense(actor, token.id, { id: GROUP.defense.id, type: 'system' });
            this._getSpecialActions(actor, token.id, { id: GROUP.specialActions.id, type: 'system' });

            // Skills
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

            // Profession Skills
            this._getProfessionSkills(actor, token.id, { id: GROUP.professionSkills.id, type: 'system' });

            // Magic
            this._getMagic('Spells', actor, token.id, { id: GROUP.spells.id, type: 'system' });
            this._getMagic('Invocations', actor, token.id, { id: GROUP.invocations.id, type: 'system' });
            this._getMagic('Witcher', actor, token.id, { id: GROUP.signs.id, type: 'system' });
            this._getMagic('Rituals', actor, token.id, { id: GROUP.rituals.id, type: 'system' });
            this._getMagic('Hexes', actor, token.id, { id: GROUP.hexes.id, type: 'system' });

            // Inventory
            const zoomableOptions = new ItemFilterOptions(FilterFn.bySystemProp('clickableImage', true), ACTION_TYPE.zoom, false);
            this._getItems(actor, token.id, { id: GROUP.zoomableItems.id, type: 'system' }, zoomableOptions);
            if (Utils.getSetting('showQuestItems')) {
                const questItemOptions = new ItemFilterOptions(FilterFn.byTypeAndSubtype('valuable', 'quest-item'), ACTION_TYPE.show, false);
                this._getItems(actor, token.id, { id: GROUP.zoomableItems.id, type: 'system' }, questItemOptions);
            }
            const consumableOptions = new ItemFilterOptions(FilterFn.byTypeAndSubtype('valuable', 'food-drink'));
            this._getItems(actor, token.id, { id: GROUP.foodAndDrinks.id, type: 'system' }, consumableOptions);
            consumableOptions.filterFn = FilterFn.byTypeAndSubtype('valuable', 'alchemical-item');
            this._getItems(actor, token.id, { id: GROUP.alchemicalItems.id, type: 'system' }, consumableOptions);
            consumableOptions.filterFn = FilterFn.byTypeAndSubtype('alchemical', 'oil');
            this._getItems(actor, token.id, { id: GROUP.oils.id, type: 'system' }, consumableOptions);
            consumableOptions.filterFn = FilterFn.byTypeAndSubtype('alchemical', 'potion');
            this._getItems(actor, token.id, { id: GROUP.potions.id, type: 'system' }, consumableOptions);
            consumableOptions.filterFn = FilterFn.byTypeAndSubtype('alchemical', 'decoction');
            this._getItems(actor, token.id, { id: GROUP.decoctions.id, type: 'system' }, consumableOptions);

            
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

        /**
         * Creates actions out of actor items.
         * @param {ItemFilterOptions} options 
         */
        _getItems(actor, tokenId, parent, options) {
            if (!options?.filterFn) {
                console.error('Cannot get item actions without a filter.');
                return;
            }
            const actions = actor.items
                .filter(options.filterFn)
                .map(item => ({
                    id: item.id,
                    name: options.showQuantity ? `${item.system.quantity}x ${item.name}` : item.name,
                    img: Utils.getImage(item),
                    encodedValue: [options.actionType, actor.id, tokenId, item.id].join(this.delimiter)
                }));
            this.addActions(actions, parent);
        }
    }
});