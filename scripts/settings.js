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
}