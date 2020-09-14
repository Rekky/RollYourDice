import {GameObject} from './GameObject';
import {Background} from './character-properties/background';
import {Class} from './character-properties/class';
import {Stats} from './character-properties/stats';
import {SavingThrows} from './character-properties/saving-throws';
import {Skills} from './character-properties/skills';
import {HitDice} from './character-properties/hit-dice';
import {Weapon} from './character-properties/weapon';
import {Equipment} from './character-properties/equipment';
import {DeathSaves} from './character-properties/death-saves';
import {Spells} from './character-properties/spells';
import {Money} from './character-properties/money';

export class Character extends GameObject {
    /* Core properties */
    background: Background;
    name: string;
    race: string;
    sex: string;
    alignment: string;
    controlledBy: string;

    /* Level modifies properties */
    class: Class;
    stats: Stats;
    skills: Skills;
    savingThrows: SavingThrows;
    hitDice: HitDice;
    languages: string[];
    proficiencies: string[];
    level: number;
    hp: number;
    proficiencyBonus: string;
    spellCastingAbility: number;
    spellSaveDc: number;
    SpellAttackBonus: number;

    /* Dynamic properties */
    weapons: Weapon[];
    equipment: Equipment;
    deathSaves: DeathSaves;
    spells: Spells;
    money: Money;
    armor: number;
    speed: number;
    currentHp: number;
    experience: number;
    initiative: number;

    constructor(hp?: number) {
        super();
        this.hp = hp ? hp : 100;
    }
}
