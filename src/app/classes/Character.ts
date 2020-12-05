import {Background} from './character-properties/background';
import {Class} from './character-properties/class';
import {Stat} from './character-properties/stat';
import {SavingThrows} from './character-properties/saving-throws';
import {Skills} from './character-properties/skills';
import {HitDice} from './character-properties/hit-dice';
import {Weapon} from './character-properties/weapon';
import {Equipment} from './character-properties/equipment';
import {DeathSaves} from './character-properties/death-saves';
import {Spells} from './character-properties/spells';
import {Currency} from './character-properties/currency';
import {Attributes} from './character-properties/attributes';

export class Character {
    /* Core properties */
    background: Background;
    name: string;
    race: string;
    sex?: string;
    alignment: string;
    controlledBy?: string;

    /* Level modifies properties */
    attributes: Attributes;
    class: Class;
    stats?: Stat[];
    skills: Skills;
    savingThrows: SavingThrows;
    hitDice: HitDice;
    languages?: string[];
    proficiencies: any[];
    level: number;
    hp?: number;
    proficiencyBonus: number;
    spellCastingAbility?: number;
    spellSaveDc?: number;
    SpellAttackBonus?: number;
    inspiration: number;
    hitPointMax: number;
    totalHitDice: number;
    featuresAndTraits: any[];

    /* Dynamic properties */
    weapons?: Weapon[];
    equipment: Equipment[];
    deathSaves: DeathSaves;
    spells?: Spells;
    currency: Currency;
    speed: number;
    currentHp?: number;
    exp: number;
    initiative: number;
    armorClass: number;
    currentHP: number;
    temporaryHP: number;
    nHitDice: number;
    attacksAndSpellcasting: any[];
    totalWeight: number;

    constructor(hp?: number) {
        this.hp = hp ? hp : 100;
    }
}
