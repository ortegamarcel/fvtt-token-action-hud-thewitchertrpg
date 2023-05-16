import { ACTION_TYPE, MODULE } from "./constants.js";
import { Utils } from "./utils.js";

export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        doHandleActionEvent(event, encodedValue) {
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
                    actor.sheet._onSkillRoll.call(actor.sheet, statNum, skillNum);
                    break;
                case ACTION_TYPE.professionSkill:
                    const skillName = args[0];
                    const _event = this._createProfessionSkillEvent(actor, skillName);
                    // right click
                    if (event.which == 3) {
                        const skill = this._getProfessionSkill(actor, skillName);
                        this._showDescription(skill.skillName, skill.definition, () => {
                            actor.sheet._onProfessionRoll.call(actor.sheet, _event);
                        });
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
                    const event = this._createDatasetEvent({ itemId });
                    actor.sheet._onItemShow(event);
                    break;
                default:
                    console.warn(`${MODULE.ID}: Unknown action "${action}"`);
                    break;
            }
        }

        /** Shows the description or effect of an item. */
        async _showDescription(title, content, btn) {
            const buttons = {
                btn,
                cancel: {
                    label: Utils.i18n('WITCHER.Button.Cancel'),
                    callback: () => {}
                }
            };
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
                    if (quantity > 1) {
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
                        content += `<div style="${descriptionStyle}">${item.system.description || item.system.effect}</div>`
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
            await this._showDescription(title, `<p>${item.system.description || item.system.effect || Utils.i18n("TAH_WITCHER.noDetailsAvailable")}</p>`, consumeBtn);

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
    }
});
