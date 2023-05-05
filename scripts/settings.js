import { MODULE } from "./constants.js";
import { Utils } from "./utils.js";

export const registerSettings = function() {
    game.settings.register(MODULE.ID, 'sortAlphabetically', {
        name: Utils.i18n('TAH_WITCHER.Settings.sortAlphabetically'),
        hint: Utils.i18n('TAH_WITCHER.Settings.sortAlphabeticallyHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
}