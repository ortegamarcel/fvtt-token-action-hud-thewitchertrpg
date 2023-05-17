import { ACTION_TYPE, MODULE, SKILL } from "./constants.js";
import { Utils } from "./utils.js";

export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        async doHandleActionEvent(event, encodedValue) {
            let payload = encodedValue.split(this.delimiter);

            if (payload.length < 3) {
                super.throwInvalidValueErr();
            }
        
            const action = payload[0];
            const actorId  = payload[1];
            const tokenId  = payload[2];
            const args = payload.slice(3);

            const actor = Utils.getActor(actorId, tokenId);
            let itemId = args?.[0];
            const item = actor.items.get(itemId);
            let _event;
                
            switch (action) {
                case ACTION_TYPE.attack:
                    actor.sheet._onItemRoll.call(actor.sheet, null, itemId);
                    break;
                case ACTION_TYPE.defense:
                    actor.sheet._onDefenceRoll.call(actor.sheet);
                    break;
                case ACTION_TYPE.initiative:
                    actor.rollInitiative({ createCombatants: true, rerollInitiative: true });
                    break;
                case ACTION_TYPE.save:
                    actor.sheet._onDeathSaveRoll.call(actor.sheet);
                    break;
                case ACTION_TYPE.critOrFumble:
                    actor.sheet._onCritRoll.call(actor.sheet);
                    break;
                case ACTION_TYPE.recover:
                    const rec = actor.system.coreStats.rec.current;
                    const currentSta = actor.system.derivedStats.sta.value;
                    const maxSta = actor.system.derivedStats.sta.max;
                    if (maxSta == currentSta) {
                        ui.notifications.warn(Utils.i18n('TAH_WITCHER.fullSta'));
                    } else {
                        actor.system.derivedStats.sta.value = Math.min(currentSta + rec, maxSta);
                        ui.notifications.info(Utils.i18n("TAH_WITCHER.gainedSta"));
                    }
                    break;
                case ACTION_TYPE.skill:
                    const statNum = Number(args[0]);
                    const skillNum = Number(args[1]);
                    try {
                        if (Utils.getSetting('rollSkillsNatively')) {
                            // This will throw an error, if the system does not expose this method (which is the case in v0.96 and lower).
                            actor.sheet._onSkillRoll.call(actor.sheet, statNum, skillNum);
                        } else {
                            await this._backupSkillRoll(actor, statNum, skillNum);
                        }
                    } catch (e) {
                        await this._backupSkillRoll(actor, statNum, skillNum);
                    }
                    break;
                case ACTION_TYPE.professionSkill:
                    const skillName = args[0];
                    _event = this._createProfessionSkillEvent(actor, skillName);
                    // right click
                    if (event.which == 3) {
                        const skill = this._getProfessionSkill(actor, skillName);
                        const btn = {
                            label: Utils.i18n('WITCHER.Dialog.ButtonRoll'),
                            callback: () => actor.sheet._onProfessionRoll.call(actor.sheet, _event)
                        };
                        this._showDescription(skill.skillName, skill.definition, btn);
                    } else {
                        actor.sheet._onProfessionRoll.call(actor.sheet, _event);
                    }
                    break;
                case ACTION_TYPE.castMagic:
                    // right click
                    if (event.which == 3) {
                        const rollBtn = {
                            label: Utils.i18n('WITCHER.Dialog.ButtonRoll'),
                            callback: () => {
                                actor.sheet._onSpellRoll.call(actor.sheet, null, itemId);
                            }
                        };
                        this._showDescription(item.name, `<p>${item.system.effect}</p>`, rollBtn);
                    } else {
                        actor.sheet._onSpellRoll.call(actor.sheet, null, itemId);
                    }
                    break;
                case ACTION_TYPE.consume:
                    this._consumeItem(actor, item);
                    break;
                case ACTION_TYPE.zoom:
                    _event = this._createDatasetEvent({ itemId });
                    try {
                        actor.sheet._onItemShow(_event);
                    } catch (e) {
                        this._showDescription(item.name, `${this._getDefaultItemDescription(item, true)}`, null);
                    }
                    break;
                case ACTION_TYPE.show:
                    this._showDescription(item.name, `${this._getDefaultItemDescription(item, true)}`, null);
                    break;
                default:
                    console.warn(`${MODULE.ID}: Unknown action "${action}"`);
                    break;
            }
        }

        /** Shows the description or effect of an item. */
        async _showDescription(title, content, btn) {
            let buttons = {};
            if (btn) {
                buttons = {
                    btn,
                    cancel: {
                        label: Utils.i18n('WITCHER.Button.Cancel'),
                        callback: () => {}
                    }
                };
            }
            return new Dialog({
                title,
                content,
                buttons
            }).render(true);
        }

        async _consumeItem(actor, item) {
            const isOil = item.system.type == 'oil';
            const isAlchemicalItem = item.system.type == 'alchemical-item';
            const isPotion = item.system.type == 'potion';
            const isDecoction = item.system.type == 'decoction';
            const isFoodOrDring = item.system.type == 'food-drink';
            
            let verb;
            if (isOil) {
                verb = "TAH_WITCHER.consumeOil";
            } else if (isAlchemicalItem) {
                verb = "TAH_WITCHER.consumeAlchemicalItem";
            } else if (isPotion) {
                verb = "TAH_WITCHER.consumePotion";
            } else if (isDecoction) {
                verb = "TAH_WITCHER.consumeDecoction";
            } else if (isFoodOrDring) {
                verb = "TAH_WITCHER.consumeFoodOrDrink";
            }
            verb = Utils.i18n(verb);
            const title = `${verb}: 1x ${item.name}`;
            const consumeBtn = {
                label: verb,
                callback: async () => {
                    const quantity = item.system.quantity;
                    if (quantity > 1 || isFoodOrDring) {
                        await item.update({ system: { quantity: quantity - 1 } });
                    } else {
                        await actor.deleteEmbeddedDocuments('Item', [item.id]);
                    }

                    let title;
                    if (isOil) {
                        title = "TAH_WITCHER.Chat.actorConsumedOil";
                    } else if (isAlchemicalItem) {
                        title = "TAH_WITCHER.Chat.actorConsumedAlchemicalItem";
                    } else if (isPotion) {
                        title = "TAH_WITCHER.Chat.actorConsumedPotion";
                    } else if (isDecoction) {
                        title = "TAH_WITCHER.Chat.actorConsumedDecoction";
                    } else if (isFoodOrDring) { 
                        title = "TAH_WITCHER.Chat.actorConsumedFoodOrDrink";
                    }
                    title = Utils.i18n(title);

                    const style = "display: flex; flex-wrap: nowrap; column-gap: 10px; align-items: center; border: 2px solid black; border-bottom-width: 1px; font-size: 15px; background: lightgoldenrodyellow;";
                    const descriptionStyle = "border: 2px solid black; border-top: none; padding: 5px; background: floralwhite;";

                    let content = `<h3>${title}</h3>`;
                    content += `<div style="${style}"><img src="${Utils.getImage(item)}" alt="Item" width="40px">1x ${item.name}</div>`;
                    if (item.system.description || item.system.effect) {
                        content += `<div style="${descriptionStyle}">${this._getDefaultItemDescription(item, false)}</div>`
                    }

                    const showToAll = Utils.getSetting('showToAll');
                    // Show Chat message
                    const chatData = {
                        speaker: ChatMessage.getSpeaker({ actor }),
                        content,
                        ...(!showToAll && { whisper: game.users.filter(user => user.isGM).map(user => user.id) })
                    };
                    ChatMessage.create(chatData);

                    if (showToAll) {
                        await (new ChatBubbles()).say(canvas.tokens.controlled[0], title);
                    }
                }
            }
            await this._showDescription(title, this._getDefaultItemDescription(item, true), consumeBtn);

            Hooks.callAll('forceUpdateTokenActionHud');
        }

        _getProfessionSkill(actor, skillName) {
            const profession = actor.items.find(item => item.type == 'profession');
            const professionSkills = Utils.getAllProfessionSkills(profession);
            return professionSkills.find(skill => skill.skillName == skillName);
        }

        _createProfessionSkillEvent(actor, skillName) {
            const skill = this._getProfessionSkill(actor, skillName);
            if (skill) {
                return this._createDatasetEvent({
                    stat: skill.stat,
                    level: skill.level,
                    name: skill.skillName,
                    effet: skill.definition
                });
            }
        }

        _createDatasetEvent(dataset) {
            return {
                preventDefault: () => {},
                currentTarget: {
                    closest: () => ({ dataset })
                }
            }
        }

        /** Fallback method when using TheWitcherTRPG v0.96 or older, since it doesn't expose the `_onSkillRoll`-Method. */
        async _backupSkillRoll(actor, statNum, skillNum) {
            const skills = Object.values(SKILL).map(skillSet => Object.entries(skillSet).map(([id, skill]) => ({ ...skill, id }))).flat();
            const skill = skills.find(skill => skill.statNum == statNum &&  skill.skillNum == skillNum);
            const actorSkill = actor.system.skills[skill.stat]?.[skill.id];
            if (!actorSkill) {
                console.error(`${MODULE.ID} | Could not find skill [${statNum}, ${skillNum}]`);
                return;
            }
            const statValue = actor.system.stats[skill.stat].current;
            const skillpoints = actorSkill.value;
            let formula = `1d10+${statValue}[Stat]+${skillpoints}[skill]`;
            actorSkill.modifiers.forEach(({ name, value }) => formula += `+${value}[${name}]`);

            this._rollD10(formula, Utils.i18n(skill.name));
        }

        /** 
         * Rolls one die (dX) or formula that will crit on highest value and fumble on 1.
         * @param {string} formula a formula that begins with 1dX, while X can be any number. Defaults to 1d10.
         * @param {string} flavor text that is shown in the chat message
         */
        async _rollD10(formula, flavor) {
            formula = formula || '1d10';
            const max = formula.match(/^1d(\d+)/)[1];
            if (!max) {
                console.error(`${MODULE.ID} | Cannot roll '${formula}'`);
            }

            let rollResult = await new Roll(formula).evaluate({ async: true });
            const result = rollResult.dice[0].results[0].result;
            const options = {};
            if (flavor) {
                options.flavor = flavor;
            }
            if (result == max) {
                options.flavor = flavor ? `${options.flavor} (${Utils.i18n("WITCHER.Crit")})` : Utils.i18n("WITCHER.Crit");
            } else if (result == 1) {
                options.flavor = flavor ? `${options.flavor} (${Utils.i18n("WITCHER.Fumble")})` : Utils.i18n("WITCHER.Fumble");
            }
            const msg = await rollResult.toMessage(options);

            if (result == 1 || result == max) {
                msg.delete();
                await Utils.waitForDiceAnimationToFinish();
                formula = result == 1
                    ? `1[${Utils.i18n("WITCHER.Dialog.ButtonRoll")}]+` + formula.split('+').slice(1).join('+') + `-1d${max}x${max}[${Utils.i18n("WITCHER.Fumble")}]`
                    : `${max}[${Utils.i18n("WITCHER.Dialog.ButtonRoll")}]+` + formula.split('+').slice(1).join('+') + `+1d${max}x${max}[${Utils.i18n("WITCHER.Crit")}]`;
                rollResult = await new Roll(formula).evaluate({ async: true });
                await rollResult.toMessage(options);
            }
        }

        _getDefaultItemDescription(item, includeImg) {
            const style = 'float: left; width: 50px; max-height: 50px; margin-right: 5px;';
            const pStyle = 'display: block; margin: 0 0 5px 0; min-height: 50px;';
            const img = includeImg
                ? `<img src="${Utils.getImage(item)}" style="${style}">`
                : '';
            return `<p style="${pStyle}">${img}${item.system.description || item.system.effect || Utils.i18n("TAH_WITCHER.noDetailsAvailable")}</p>`;
        }
    }
});
