/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'fvtt-token-action-hud-thewitchertrpg'
};

/**
 * Gwen't - The Dice Game Module
 */
export const GWENT_MODULE = {
    ID: 'fvtt-gwent',
    SETTINGS: {
        GAME_NAME: 'gameName',
        BOARD_ID: 'boardId'
    }
};

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
};

/**
 * Dice so Nice Module
 */
export const DSN_MODULE = {
    ID: 'dice-so-nice'
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
    initiative: 'initiative',
    save: 'save',
    critOrFumble: 'crit_or_fumble',
    recover: 'recover',
    skill: 'skill',
    professionSkill: 'profession_skill',
    castMagic: 'castMagic',
    consume: 'consume',
    zoom: 'zoom',
    show: 'show',
    playGwent: 'play_gwent',
    showGwentBoard: 'show_gwent_board',
};

export const GROUP = {
    // combat
    attack: { id: 'attack', name: 'TAH_WITCHER.attack', type: 'system' },
    defense: { id: 'defense', name: 'WITCHER.Actor.Defense', type: 'system' },
    specialActions: { id: 'special-actions', name: 'TAH_WITCHER.specialActions', type: 'system' },

    // skills
    allSkills: { id: 'all_skills', name: 'WITCHER.Monster.SkillTab', type: 'system' },
    intSkills: { id: 'int_skills', name: 'WITCHER.StInt', type: 'system' },
    refSkills: { id: 'ref_skills', name: 'WITCHER.StRef', type: 'system' },
    dexSkills: { id: 'dex_skills', name: 'WITCHER.StDex', type: 'system' },
    bodySkills: { id: 'body_skills', name: 'WITCHER.StBody', type: 'system' },
    empSkills: { id: 'emp_skills', name: 'WITCHER.StEmp', type: 'system' },
    craSkills: { id: 'cra_skills', name: 'WITCHER.StCra', type: 'system' },
    willSkills: { id: 'will_skills', name: 'WITCHER.StWill', type: 'system' },

    // profession skills
    professionSkills: { id: 'profession_skills', name: 'TAH_WITCHER.professionSkills', type: 'system' },

    // magic
    spells: { id: 'spells', name: 'WITCHER.Spell.Spells', type: 'system' },
    invocations: { id: 'invocations', name: 'WITCHER.Spell.Invocations', type: 'system' },
    signs: { id: 'signs', name: 'WITCHER.Spell.Witcher', type: 'system' },
    rituals: { id: 'rituals', name: 'WITCHER.Spell.Rituals', type: 'system' },
    hexes: { id: 'hexes', name: 'WITCHER.Spell.Hexes', type: 'system' },

    // inventory
    zoomableItems: { id: 'zoomable-items', name: 'TAH_WITCHER.zoomableItems', type: 'system' },
    foodAndDrinks: { id: 'food-and-drinks', name: 'WITCHER.Valuable.Food&Drinks', type: 'system' },
    alchemicalItems: { id: 'alechmical-items', name: 'WITCHER.Inventory.AlchemicalItems', type: 'system' },
    potions: { id: 'potions', name: 'TAH_WITCHER.potions', type: 'system' },
    decoctions: { id: 'decoctions', name: 'TAH_WITCHER.decoctions', type: 'system' },
    oils: { id: 'oils', name: 'WITCHER.Inventory.Oils', type: 'system' },

    // Gwen't - The Dice Game
    gwentDecks: { id: 'gwent-decks', name: 'TAH_WITCHER.Gwent.decks', type: 'system' },
    gwentBoards: { id: 'gwent-boards', name: 'TAH_WITCHER.Gwent.gameBoards', type: 'system' },
};

export const SKILL = {
    int: {
        awareness: { stat: 'int', active: true, name: 'WITCHER.SkIntAwareness', statNum: 0, skillNum: 0 },
        business: { stat: 'int', active: false, name: 'WITCHER.SkIntBusiness', statNum: 0, skillNum: 1 },
        deduction: { stat: 'int', active: true, name: 'WITCHER.SkIntDeduction', statNum: 0, skillNum: 2 },
        education: { stat: 'int', active: true, name: 'WITCHER.SkIntEducation', statNum: 0, skillNum: 3 },
        commonsp: { stat: 'int', active: false, name: 'WITCHER.SkIntCommon', statNum: 0, skillNum: 4 },
        eldersp: { stat: 'int', active: false, name: 'WITCHER.SkIntElder', statNum: 0, skillNum: 5 },
        dwarven: { stat: 'int', active: false, name: 'WITCHER.SkIntDwarven', statNum: 0, skillNum: 6 },
        monster: { stat: 'int', active: false, name: 'WITCHER.SkIntMonster', statNum: 0, skillNum: 7 },
        socialetq: { stat: 'int', active: false, name: 'WITCHER.SkIntSocialEt', statNum: 0, skillNum: 8 },
        streetwise: { stat: 'int', active: false, name: 'WITCHER.SkIntStreet', statNum: 0, skillNum: 9 },
        tactics: { stat: 'int', active: false, name: 'WITCHER.SkIntTactics', statNum: 0, skillNum: 10 },
        teaching: { stat: 'int', active: false, name: 'WITCHER.SkIntTeaching', statNum: 0, skillNum: 11 },
        wilderness: { stat: 'int', active: true, name: 'WITCHER.SkIntWilderness', statNum: 0, skillNum: 12 },
    },
    ref: {
        brawling: { stat: 'ref', active: true, name: 'WITCHER.SkRefBrawling', statNum: 1, skillNum: 0 },
        dodge: { stat: 'ref', active: true, name: 'WITCHER.SkRefDodge', statNum: 1, skillNum: 1 },
        melee: { stat: 'ref', active: false, name: 'WITCHER.SkRefMelee', statNum: 1, skillNum: 2 },
        riding: { stat: 'ref', active: true, name: 'WITCHER.SkRefRiding', statNum: 1, skillNum: 3 },
        sailing: { stat: 'ref', active: false, name: 'WITCHER.SkRefSailing', statNum: 1, skillNum: 4 },
        smallblades: { stat: 'ref', active: false, name: 'WITCHER.SkRefSmall', statNum: 1, skillNum: 5 },
        staffspear: { stat: 'ref', active: false, name: 'WITCHER.SkRefStaff', statNum: 1, skillNum: 6 },
        swordsmanship: { stat: 'ref', active: false, name: 'WITCHER.SkRefSwordsmanship', statNum: 1, skillNum: 7 },
    },
    dex: {
        archery: { stat: 'dex', active: false, name: 'WITCHER.SkDexArchery', statNum: 2, skillNum: 0 },
        athletics: { stat: 'dex', active: true, name: 'WITCHER.SkDexAthletics', statNum: 2, skillNum: 1 },
        crossbow: { stat: 'dex', active: false, name: 'WITCHER.SkDexCrossbow', statNum: 2, skillNum: 2 },
        sleight: { stat: 'dex', active: false, name: 'WITCHER.SkDexSleight', statNum: 2, skillNum: 3 },
        stealth: { stat: 'dex', active: true, name: 'WITCHER.SkDexStealth', statNum: 2, skillNum: 4 },
    },
    body: {
        physique: { stat: 'body', active: true, name: 'WITCHER.SkBodyPhys', statNum: 3, skillNum: 0 },
        endurance: { stat: 'body', active: true, name: 'WITCHER.SkBodyEnd', statNum: 3, skillNum: 1 },
    },
    emp: {
        charisma: { stat: 'emp', active: true, name: 'WITCHER.SkEmpCharisma', statNum: 4, skillNum: 0 },
        deceit: { stat: 'emp', active: true, name: 'WITCHER.SkEmpDeceit', statNum: 4, skillNum: 1 },
        finearts: { stat: 'emp', active: false, name: 'WITCHER.SkEmpArts', statNum: 4, skillNum: 2 },
        gambling: { stat: 'emp', active: false, name: 'WITCHER.SkEmpGambling', statNum: 4, skillNum: 3 },
        grooming: { stat: 'emp', active: false, name: 'WITCHER.SkEmpGrooming', statNum: 4, skillNum: 4 },
        perception: { stat: 'emp', active: true, name: 'WITCHER.SkEmpHumanPerc', statNum: 4, skillNum: 5 },
        leadership: { stat: 'emp', active: true, name: 'WITCHER.SkEmpLeadership', statNum: 4, skillNum: 6 },
        persuasion: { stat: 'emp', active: true, name: 'WITCHER.SkEmpPersuasion', statNum: 4, skillNum: 7 },
        performance: { stat: 'emp', active: false, name: 'WITCHER.SkEmpPerformance', statNum: 4, skillNum: 8 },
        seduction: { stat: 'emp', active: true, name: 'WITCHER.SkEmpSeduction', statNum: 4, skillNum: 9 },
    },
    cra: {
        alchemy: { stat: 'cra', active: false, name: 'WITCHER.SkCraAlchemy', statNum: 5, skillNum: 0 },
        crafting: { stat: 'cra', active: false, name: 'WITCHER.SkCraCrafting', statNum: 5, skillNum: 1 },
        disguise: { stat: 'cra', active: false, name: 'WITCHER.SkCraDisguise', statNum: 5, skillNum: 2 },
        firstaid: { stat: 'cra', active: true, name: 'WITCHER.SkCraAid', statNum: 5, skillNum: 3 },
        forgery: { stat: 'cra', active: false, name: 'WITCHER.SkCraForge', statNum: 5, skillNum: 4 },
        picklock: { stat: 'cra', active: true, name: 'WITCHER.SkCraPick', statNum: 5, skillNum: 5 },
        trapcraft: { stat: 'cra', active: false, name: 'WITCHER.SkCraTrapCraft', statNum: 5, skillNum: 6 },
    },
    will: {
        courage: { stat: 'will', active: true, name: 'WITCHER.SkWillCourage', statNum: 6, skillNum: 0 },
        hexweave: { stat: 'will', active: false, name: 'WITCHER.SkWillHex', statNum: 6, skillNum: 1 },
        intimidation: { stat: 'will', active: true, name: 'WITCHER.SkWillIntim', statNum: 6, skillNum: 2 },
        spellcast: { stat: 'will', active: true, name: 'WITCHER.SkWillSpellcast', statNum: 6, skillNum: 3 },
        resistmagic: { stat: 'will', active: true, name: 'WITCHER.SkWillResistMag', statNum: 6, skillNum: 4 },
        resistcoerc: { stat: 'will', active: true, name: 'WITCHER.SkWillResistCoer', statNum: 6, skillNum: 5 },
        ritcraft: { stat: 'will', active: false, name: 'WITCHER.SkWillRitCraft', statNum: 6, skillNum: 6 },
    }
}