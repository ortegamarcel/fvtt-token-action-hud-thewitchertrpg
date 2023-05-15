import { GROUP } from './constants.js'

/**
 * Default categories and groups
 */
export let DEFAULTS = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'combat',
                id: 'combat',
                name: coreModule.api.Utils.i18n('TAH_WITCHER.combat'),
                groups: [
                    { ...groups.attack, nestId: 'combat_attack' },
                    { ...groups.defense, nestId: 'combat_defense' },
                    { ...groups.specialActions, nestId: 'combat_special-actions' }
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('WITCHER.Monster.SkillTab'),
                groups: [
                    { ...groups.allSkills, nestId: 'skills_all' },
                    { ...groups.intSkills, nestId: 'skills_int' },
                    { ...groups.refSkills, nestId: 'skills_ref' },
                    { ...groups.dexSkills, nestId: 'skills_dex' },
                    { ...groups.bodySkills, nestId: 'skills_body' },
                    { ...groups.empSkills, nestId: 'skills_emp' },
                    { ...groups.craSkills, nestId: 'skills_cra' },
                    { ...groups.willSkills, nestId: 'skills_will' },
                    { ...groups.test, nestId: 'skills_test' },
                ]
            },
            {
                nestId: 'profession',
                id: 'profession',
                name: coreModule.api.Utils.i18n('TAH_WITCHER.professionSkills'),
                groups: [
                    { ...groups.professionSkills, nestId: 'profession_skills' }
                ]
            },
            {
                nestId: 'magic',
                id: 'magic',
                name: coreModule.api.Utils.i18n('TAH_WITCHER.magic'),
                groups: [
                    { ...groups.spells, nestId: 'magic_spells' },
                    { ...groups.invocations, nestId: 'magic_invocations' },
                    { ...groups.signs, nestId: 'magic_signs' },
                    { ...groups.rituals, nestId: 'magic_rituals' },
                    { ...groups.hexes, nestId: 'magic_hexes' },
                ]
            },
            {
                nestId: 'consumables',
                id: 'consumables',
                name: coreModule.api.Utils.i18n('TAH_WITCHER.consumables'),
                groups: [
                    { ...groups.foodAndDrinks, nestId: 'consumables_food-and-drinks' },
                    { ...groups.alchemicalItems, nestId: 'consumables_alchemical-items' },
                    { ...groups.oils, nestId: 'consumables_oils' },
                    { ...groups.potions, nestId: 'consumables_potions' },
                    { ...groups.decoctions, nestId: 'consumables_decoctions' },
                ]
            }
        ],
        groups: groupsArray
    }
});