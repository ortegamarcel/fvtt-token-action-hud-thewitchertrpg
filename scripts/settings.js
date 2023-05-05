import { MODULE } from "./constants.js";
import { Utils } from "./utils.js";

export const registerSettings = function() {
    game.settings.register(MODULE.ID, 'sortSkillsAlphabetically', {
        name: Utils.i18n('TAH_WITCHER.Settings.sortSkillsAlphabetically'),
        hint: Utils.i18n('TAH_WITCHER.Settings.sortSkillsAlphabeticallyHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE.ID, 'showSkillCategories', {
        name: Utils.i18n('TAH_WITCHER.Settings.showSkillCategories'),
        hint: Utils.i18n('TAH_WITCHER.Settings.showSkillCategoriesHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE.ID, 'showSkillSuffix', {
        name: Utils.i18n('TAH_WITCHER.Settings.showSkillSuffix'),
        hint: Utils.i18n('TAH_WITCHER.Settings.showSkillSuffixHint'),
        scope: 'client',
        config: true,
        type: String,
        default: 'always',
        choices: {
            never: Utils.i18n('TAH_WITCHER.Settings.showSkillSuffixNever'),
            ifSkilled: Utils.i18n('TAH_WITCHER.Settings.showSkillSuffixIfSkilled'),
            always: Utils.i18n('TAH_WITCHER.Settings.showSkillSuffixAlways')
        }
    });

    game.settings.register(MODULE.ID, 'skillSuffix', {
        name: Utils.i18n('TAH_WITCHER.Settings.skillSuffix'),
        hint: Utils.i18n('TAH_WITCHER.Settings.skillSuffixHint'),
        scope: 'client',
        config: true,
        type: String,
        default: 'basevalue',
        choices: {
            skillpoints: Utils.i18n('TAH_WITCHER.Settings.skillSuffixSkillpoints'),
            basevalue: Utils.i18n('TAH_WITCHER.Settings.skillSuffixBasevalue')
        }
    });
}