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
                    { ...groups.defense, nestId: 'combat_defense' }
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('WITCHER.Monster.SkillTab'),
                groups: [
                    { ...groups.intSkills, nestId: 'skills_int' },
                    { ...groups.refSkills, nestId: 'skills_ref' },
                    { ...groups.dexSkills, nestId: 'skills_dex' },
                    { ...groups.bodySkills, nestId: 'skills_body' },
                    { ...groups.empSkills, nestId: 'skills_emp' },
                    { ...groups.craSkills, nestId: 'skills_cra' },
                    { ...groups.willSkills, nestId: 'skills_will' },
                ]
            },
            {
                nestId: 'magic',
                id: 'magic',
                name: coreModule.api.Utils.i18n('TAH_WITCHER.magic'),
                groups: [
                ]
            }
        ],
        groups: groupsArray
    }
});