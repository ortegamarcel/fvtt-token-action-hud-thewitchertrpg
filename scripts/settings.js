import SkillSettingsMenu from "./settings/SkillSettingsMenu.js";
import { MODULE, SKILL } from "./constants.js";
import { Utils } from "./utils.js";

function onChange(value) {
    Hooks.callAll('forceUpdateTokenActionHud');
}

export const registerSettings = function() {
    game.settings.registerMenu(MODULE.ID, "skillSettingsMenu", {
        name: Utils.i18n('TAH_WITCHER.Settings.skillSettings'),
        label: Utils.i18n('TAH_WITCHER.Settings.skillSettingsLabel'),
        hint: Utils.i18n('TAH_WITCHER.Settings.skillSettingsHint'),
        icon: "fas fa-eye-low-vision",
        type: SkillSettingsMenu,
        restricted: false
    });

    game.settings.register(MODULE.ID, 'skillSettings', {
        scope: 'client',
        config: false,
        type: Object,
        default: SKILL,
        onChange
    });

    game.settings.register(MODULE.ID, 'sortSkillsAlphabetically', {
        name: Utils.i18n('TAH_WITCHER.Settings.sortSkillsAlphabetically'),
        hint: Utils.i18n('TAH_WITCHER.Settings.sortSkillsAlphabeticallyHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange
    });

    game.settings.register(MODULE.ID, 'showSkillCategories', {
        name: Utils.i18n('TAH_WITCHER.Settings.showSkillCategories'),
        hint: Utils.i18n('TAH_WITCHER.Settings.showSkillCategoriesHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange
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
        },
        onChange
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
        },
        onChange
    });

    game.settings.register(MODULE.ID, 'showMagicStaCost', {
        name: Utils.i18n('TAH_WITCHER.Settings.showMagicStaCost'),
        hint: Utils.i18n('TAH_WITCHER.Settings.showMagicStaCostHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange
    });

    game.settings.register(MODULE.ID, 'magicVarStaCostLabel', {
        name: Utils.i18n('TAH_WITCHER.Settings.magicVarStaCostLabel'),
        hint: Utils.i18n('TAH_WITCHER.Settings.magicVarStaCostLabelHint'),
        scope: 'client',
        config: true,
        type: String,
        default: 'X',
        onChange
    });

    game.settings.register(MODULE.ID, 'showToAll', {
        name: Utils.i18n('TAH_WITCHER.Settings.showToAll'),
        hint: Utils.i18n('TAH_WITCHER.Settings.showToAllHint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE.ID, 'showQuestItems', {
        name: Utils.i18n('TAH_WITCHER.Settings.showQuestItems'),
        hint: Utils.i18n('TAH_WITCHER.Settings.showQuestItemsHint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        onChange
    });

    game.settings.register(MODULE.ID, 'showUnsupportedSystemMessage', {
        name: Utils.i18n('TAH_WITCHER.Settings.showUnsupportedSystemMessage'),
        hint: Utils.i18n('TAH_WITCHER.Settings.showUnsupportedSystemMessageHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
}