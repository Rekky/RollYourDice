import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-character-sheet',
    templateUrl: './character-sheet.component.html',
    styleUrls: ['./character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit {

    character: any = {
        name: 'Steiner',
        class: 'paladin',
        level: 2,
        race: 'standard human',
        alignment: 'neutral good',
        exp: 700,
        attr: {
            str: {
                bonus: 2,
                points: 14
            },
            dex: {
                bonus: -1,
                points: 9
            },
            con: {
                bonus: 2,
                points: 15
            },
            int: {
                bonus: 0,
                points: 11
            },
            wis: {
                bonus: 1,
                points: 13
            },
            cha: {
                bonus: 3,
                points: 16
            }
        },
        inspiration: 1,
        proficiencyBonus: 2,
        savingThrows: {
            str: {
                selected: false,
                value: 2
            },
            dex: {
                selected: false,
                value: -1
            },
            con: {
                selected: false,
                value: 2
            },
            int: {
                selected: false,
                value: 0
            },
            wis: {
                selected: true,
                value: 3
            },
            cha: {
                selected: true,
                value: 5
            }
        },
        skills: {
            acrobatics: {
                selected: false,
                value: -1,
                attr: 'dex'
            },
            animalHandling: {
                selected: false,
                value: 1,
                attr: 'wis'
            },
            arcana: {
                selected: false,
                value: 0,
                attr: 'int'
            },
            athletics: {
                selected: true,
                value: 4,
                attr: 'str'
            },
            deception: {
                selected: false,
                value: 3,
                attr: 'cha'
            },
            history: {
                selected: false,
                value: 0,
                attr: 'int'
            },
            insight: {
                selected: false,
                value: 1,
                attr: 'wis'
            },
            intimidation: {
                selected: true,
                value: 5,
                attr: 'cha'
            },
            investigation: {
                selected: false,
                value: 0,
                attr: 'int'
            },
            medicine: {
                selected: true,
                value: 3,
                attr: 'wis'
            },
            nature: {
                selected: false,
                value: 0,
                attr: 'int'
            },
            perception: {
                selected: false,
                value: 1,
                attr: 'wis'
            },
            performance: {
                selected: false,
                value: 3,
                attr: 'cha'
            },
            persuasion: {
                selected: true,
                value: 5,
                attr: 'cha'
            },
            religion: {
                selected: false,
                value: 0,
                attr: 'int'
            },
            sleightOfHand: {
                selected: false,
                value: -1,
                attr: 'dex'
            },
            stealth: {
                selected: false,
                value: -1,
                attr: 'dex'
            },
            survival: {
                selected: false,
                value: 1,
                attr: 'wis'
            },
        },
        proficiencies: [
            {
                type: 'language',
                name: 'common'
            },
            {
                type: 'language',
                name: 'Celestial'
            },
            {
                type: 'armor',
                name: 'Heavy Armor'
            },
            {
                type: 'armor',
                name: 'Light Armor'
            },
            {
                type: 'armor',
                name: 'Medium Armor'
            },
            {
                type: 'armor',
                name: 'Shields'
            },
            {
                type: 'weapon',
                name: 'Martial Weapons'
            },
            {
                type: 'weapon',
                name: 'Simple Weapons'
            },
            {
                type: 'custom',
                name: 'Dark Magic Weapons'
            },
            {
                type: 'tools',
                name: 'Drum'
            },
            {
                type: 'tools',
                name: 'Land Vehicles'
            }
        ],
        armorClass: 19,
        initiative: -1,
        speed: 30,
        hitPointMax: 24,
        currentHP: 0,
        temporaryHP: 0,
        hitDice: 'D10',
        nHitDice: 2,
        totalHitDice: 2,
        deathSaves: {
            success: [true, false, false],
            failures: [true, true, true]
        },
        attacksAndSpellcasting: [
            {
                name: 'Greatsword',
                attack: 4,
                dice: {
                    n: 2,
                    value: 6,
                    bonus: 2
                },
                type: 'Slashing'
            },
            {
                name: 'Spear (One-Handling)',
                attack: 4,
                dice: {
                    n: 1,
                    value: 6,
                    bonus: 2
                },
                type: 'Piercing'
            },
            {
                name: 'Spear (Two-Handling)',
                attack: 4,
                dice: {
                    n: 1,
                    value: 8,
                    bonus: 2
                },
                type: 'Piercing'
            },
            {
                name: 'Divine Smite',
                attack: null,
                dice: {
                    n: 2,
                    value: 8,
                    bonus: 0
                },
                type: 'Radiant'
            },
            {
                name: 'Divine Smite Undead',
                attack: null,
                dice: {
                    n: 3,
                    value: 8,
                    bonus: 0
                },
                type: 'Radiant'
            },
            {
                name: 'Cure Wounds',
                attack: null,
                dice: {
                    n: 1,
                    value: 8,
                    bonus: 3
                },
                type: 'Healing'
            },
            {
                name: 'Torch',
                attack: 7,
                type: 'Fire'
            }
        ],
        currency: {
            pp: 0,
            gp: 9,
            ep: 0,
            sp: 30,
            cp: 5
        },
        totalWeight: 101.18,
        equipment: [
            {
                quantity: 1,
                name: 'Holy symbol',
                weight: 0
            },
            {
                quantity: 1,
                name: 'Greatsword',
                weight: 6
            },
            {
                quantity: 1,
                name: 'Shield',
                weight: 6
            },
            {
                quantity: 1,
                name: 'Spear',
                weight: 3
            },
            {
                quantity: 1,
                name: 'Explorer\'s pack',
                weight: 0
            },
            {
                quantity: 1,
                name: 'Chain mail',
                weight: 55
            },
            {
                quantity: 1,
                name: 'Backpack',
                weight: 5
            }
        ],
        background: {
            name: 'Soldier',
            specialty: 'Officer',
            personalityTrait: 'I have a crude sense of humor.',
            ideals: 'Responsibility. I do what I must and obey just authority.',
            bonds: 'Those who fight beside me are those worth dying for.',
            flaws: 'I\'d rather eat my armor than admit when I\'m wrong.'
        },
        featuresAndTraits: [
            {
                name: 'Lay on hands',
                source: 'Class',
                sourceType: 'Paladin'
            },
            {
                name: 'Divine sense',
                source: 'Class',
                sourceType: 'Paladin'
            },
            {
                name: 'Military rank: Officer',
                source: 'Background',
                sourceType: 'Soldier'
            },
            {
                name: 'Divine smite',
                source: 'Class',
                sourceType: 'Paladin'
            },
            {
                name: 'Fighting style: defense',
                source: 'Class',
                sourceType: 'Paladin'
            }
        ]
    };

    constructor() { }

    ngOnInit(): void {
    }

}
