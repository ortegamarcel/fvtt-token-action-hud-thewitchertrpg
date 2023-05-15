import { MODULE, SKILL } from "../constants.js";

export default class SkillSettingsMenu extends FormApplication {
    static get defaultOptions () {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.localize('TAH_WITCHER.Settings.skillSettings'),
            template: `/modules/${MODULE.ID}/templates/skill-settings-menu.hbs`,
            width: 662,
            height: 'auto',
            closeOnSubmit: true
        });
    }

    constructor (...args) {
        super(args)
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('#tahw-skill-settings-reset').bind('click', this._reset.bind(this));
        html.find('#tahw-skill-settings-deselect-all').bind('click', this._deselectAll.bind(this));
        html.find('#tahw-skill-settings-select-all').bind('click', this._selectAll.bind(this));
    }

    getData() {
        const skillSettings = game.settings.get(MODULE.ID, 'skillSettings');
        const data = {
            skills: skillSettings
        };
        return data;
    }

    _onChangeInput(event) {
        const formData = this._getSubmitData();
        this._updateObject(event, formData);
    }

    _updateObject(event, formData) {
        const skillData = this.getData().skills;
        Object.entries(formData).forEach(([key, active]) => {
            const k = key.split('-');
            const skillName = k[0];
            const stat = k[1];
            skillData[stat][skillName].active = active;
        });
        game.settings.set(MODULE.ID, 'skillSettings', skillData);
    }

    _deselectAll() {
        this._setAll(false);
    }

    _selectAll() {
        this._setAll(true);
    }

    _setAll(active) {
        const skillData = this.getData().skills;
        Object.entries(skillData).forEach(([stat, skills]) => {
            Object.keys(skills).forEach(skill => {
                skillData[stat][skill].active = active;
            });
        });
        game.settings.set(MODULE.ID, 'skillSettings', skillData);
        this.render(true);
    }

    _reset() {
        game.settings.set(MODULE.ID, 'skillSettings', SKILL);
        this.render(true);
    }
}