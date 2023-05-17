import { MODULE, DSN_MODULE } from './constants.js'

export let Utils = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    Utils = class Utils extends coreModule.api.Utils {
        /**
         * Get setting value
         * @param {string} key The key
         * @param {string=null} defaultValue The default value
         * @returns The setting value
         */
        static getSetting(key, defaultValue = null) {
            let value = defaultValue ?? null
            try {
                value = game.settings.get(MODULE.ID, key)
            } catch {
                coreModule.api.Logger.debug(`Setting '${key}' not found`)
            }
            return value
        }

        /**
         * Set setting value
         * @param {string} key The key
         * @param {string} value The value
         */
        static async setSetting(key, value) {
            try {
                value = await game.settings.set(MODULE.ID, key, value)
                coreModule.api.Logger.debug(`Setting '${key}' set to '${value}'`)
            } catch {
                coreModule.api.Logger.debug(`Setting '${key}' not found`)
            }
        }

        /**
         * Returns all profession skills with `level`, `stat`, `skillName` and `definition`.
         * @param {Item} profession 
         */
        static getAllProfessionSkills(profession) {
            if (!profession || profession.type != 'profession') {
                return;
            }

            const skills = [
                { ...profession.system.definingSkill },
                { ...profession.system.skillPath1.skill1 },
                { ...profession.system.skillPath1.skill2 },
                { ...profession.system.skillPath1.skill3 },
                { ...profession.system.skillPath2.skill1 },
                { ...profession.system.skillPath2.skill2 },
                { ...profession.system.skillPath2.skill3 },
                { ...profession.system.skillPath3.skill1 },
                { ...profession.system.skillPath3.skill2 },
                { ...profession.system.skillPath3.skill3 },
            ];
            return skills;
        }

        static mergeDeep(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();
        
            if (isObject(target) && isObject(source)) {
                for (const key in source) {
                    if (isObject(source[key])) {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        mergeDeep(target[key], source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            }
        
            return mergeDeep(target, ...sources);
        }

        static async waitForDiceAnimationToFinish() {
            if (game.modules.get(DSN_MODULE.ID)?.active) {
                const animationDuration = 2000;
                return new Promise(res => setTimeout(res, animationDuration));
            } else {
                return Promise.resolve();
            }
        }
    }
})