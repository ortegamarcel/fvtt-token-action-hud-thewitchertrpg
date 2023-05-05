/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'fvtt-token-action-hud-TheWitcherTRPG'
};

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
};

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '1.4';

/**
 * <i>-tag icons
 */
export const ICON = {
    defense: '<i class="fa fa-shield"></i>'
}

/**
 * Action type
 */
export const ACTION_TYPE = {
    attack: 'attack',
    defense: 'defense',
    skill: 'skill'
};

export const GROUP = {
    attack: { id: 'attack', name: 'TAH_WITCHER.attack', type: 'system' },
    defense: { id: 'defense', name: 'WITCHER.Actor.Defense', type: 'system' },
    allSkills: { id: 'all_skills', name: 'WITCHER.Monster.SkillTab', type: 'system' },
    intSkills: { id: 'int_skills', name: 'WITCHER.StInt', type: 'system' },
    refSkills: { id: 'ref_skills', name: 'WITCHER.StRef', type: 'system' },
    dexSkills: { id: 'dex_skills', name: 'WITCHER.StDex', type: 'system' },
    bodySkills: { id: 'body_skills', name: 'WITCHER.StBody', type: 'system' },
    empSkills: { id: 'emp_skills', name: 'WITCHER.StEmp', type: 'system' },
    craSkills: { id: 'cra_skills', name: 'WITCHER.StCra', type: 'system' },
    willSkills: { id: 'will_skills', name: 'WITCHER.StWill', type: 'system' }
};

export const SKILL = {
    int: {
        awareness: { active: true, name: 'WITCHER.SkIntAwareness', statNum: 0, skillNum: 0 },
        business: { active: false, name: 'WITCHER.SkIntBusiness', statNum: 0, skillNum: 1 },
        deduction: { active: true, name: 'WITCHER.SkIntDeduction', statNum: 0, skillNum: 2 },
        education: { active: true, name: 'WITCHER.SkIntEducation', statNum: 0, skillNum: 3 },
        commonsp: { active: false, name: 'WITCHER.SkIntCommon', statNum: 0, skillNum: 4 },
        eldersp: { active: false, name: 'WITCHER.SkIntElder', statNum: 0, skillNum: 5 },
        dwarven: { active: false, name: 'WITCHER.SkIntDwarven', statNum: 0, skillNum: 6 },
        monster: { active: false, name: 'WITCHER.SkIntMonster', statNum: 0, skillNum: 7 },
        socialetq: { active: false, name: 'WITCHER.SkIntSocialEt', statNum: 0, skillNum: 8 },
        streetwise: { active: false, name: 'WITCHER.SkIntStreet', statNum: 0, skillNum: 9 },
        tactics: { active: false, name: 'WITCHER.SkIntTactics', statNum: 0, skillNum: 10 },
        teaching: { active: false, name: 'WITCHER.SkIntTeaching', statNum: 0, skillNum: 11 },
        wilderness: { active: true, name: 'WITCHER.SkIntWilderness', statNum: 0, skillNum: 12 },
    },
    ref: {
        brawling: { active: true, name: 'WITCHER.SkRefBrawling', statNum: 1, skillNum: 0 },
        dodge: { active: true, name: 'WITCHER.SkRefDodge', statNum: 1, skillNum: 1 },
        melee: { active: false, name: 'WITCHER.SkRefMelee', statNum: 1, skillNum: 2 },
        riding: { active: true, name: 'WITCHER.SkRefRiding', statNum: 1, skillNum: 3 },
        sailing: { active: false, name: 'WITCHER.SkRefSailing', statNum: 1, skillNum: 4 },
        smallblades: { active: false, name: 'WITCHER.SkRefSmall', statNum: 1, skillNum: 5 },
        stattspear: { active: false, name: 'WITCHER.SkRefStaff', statNum: 1, skillNum: 6 },
        swordsmanship: { active: false, name: 'WITCHER.SkRefSwordsmanship', statNum: 1, skillNum: 7 },
    },
    dex: {
        archery: { active: false, name: 'WITCHER.SkDexArchery', statNum: 2, skillNum: 0 },
        athletics: { active: true, name: 'WITCHER.SkDexAthletics', statNum: 2, skillNum: 1 },
        crossbow: { active: false, name: 'WITCHER.SkDexAthletics', statNum: 2, skillNum: 2 },
        sleight: { active: false, name: 'WITCHER.SkDexAthletics', statNum: 2, skillNum: 3 },
        stealth: { active: true, name: 'WITCHER.SkDexAthletics', statNum: 2, skillNum: 4 },
    },
    body: {
        physique: { active: true, name: 'WITCHER.SkBodyPhys', statNum: 3, skillNum: 0 },
        endurance: { active: true, name: 'WITCHER.SkBodyEnd', statNum: 3, skillNum: 1 },
    },
    emp: {
        charisma: { active: true, name: 'WITCHER.SkEmpCharisma', statNum: 4, skillNum: 0 },
        deceit: { active: true, name: 'WITCHER.SkEmpDeceit', statNum: 4, skillNum: 1 },
        finearts: { active: false, name: 'WITCHER.SkEmpArts', statNum: 4, skillNum: 2 },
        gambling: { active: false, name: 'WITCHER.SkEmpGambling', statNum: 4, skillNum: 3 },
        grooming: { active: false, name: 'WITCHER.SkEmpGrooming', statNum: 4, skillNum: 4 },
        perception: { active: true, name: 'WITCHER.SkEmpHumanPerc', statNum: 4, skillNum: 5 },
        leadership: { active: true, name: 'WITCHER.SkEmpLeadership', statNum: 4, skillNum: 6 },
        persuation: { active: true, name: 'WITCHER.SkEmpPersuasion', statNum: 4, skillNum: 7 },
        performance: { active: false, name: 'WITCHER.SkEmpPerformance', statNum: 4, skillNum: 8 },
        seduction: { active: true, name: 'WITCHER.SkEmpSeduction', statNum: 4, skillNum: 9 },
    },
    cra: {
        alchemy: { active: false, name: 'WITCHER.SkCraAlchemy', statNum: 5, skillNum: 0 },
        crafting: { active: false, name: 'WITCHER.SkCraCrafting', statNum: 5, skillNum: 1 },
        disguise: { active: false, name: 'WITCHER.SkCraDisguise', statNum: 5, skillNum: 2 },
        firstaid: { active: true, name: 'WITCHER.SkCraAid', statNum: 5, skillNum: 3 },
        forgery: { active: false, name: 'WITCHER.SkCraForge', statNum: 5, skillNum: 4 },
        picklock: { active: true, name: 'WITCHER.SkCraPick', statNum: 5, skillNum: 5 },
        trapcraft: { active: false, name: 'WITCHER.SkCraTrapCraft', statNum: 5, skillNum: 6 },
    },
    will: {
        courage: { active: true, name: 'WITCHER.SkWillCourage', statNum: 6, skillNum: 0 },
        hexweave: { active: false, name: 'WITCHER.SkWillHex', statNum: 6, skillNum: 1 },
        intimidation: { active: true, name: 'WITCHER.SkWillIntim', statNum: 6, skillNum: 2 },
        spellcast: { active: false, name: 'WITCHER.SkWillSpellcast', statNum: 6, skillNum: 3 },
        resistmagic: { active: true, name: 'WITCHER.SkWillResistMag', statNum: 6, skillNum: 4 },
        resistcoerc: { active: true, name: 'WITCHER.SkWillResistCoer', statNum: 6, skillNum: 5 },
        ritcraft: { active: false, name: 'WITCHER.SkWillRitCraft', statNum: 6, skillNum: 6 },
    }
}