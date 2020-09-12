import {Coords} from './Coords';

export class Monster {
    id: string | number;
    name: string;
    hp: number;
    damage: number;
    position: Coords;

    constructor(id?: string | number,
                name?: string,
                hp?: number,
                damage?: number,
                position?: Coords) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new monster';
        this.hp = hp ? hp : 100;
        this.damage = damage ? damage : 10;
        this.position = position ? position : new Coords();
    }

    static fromJSON(json: any): Monster {
        const monster = new Monster();
        monster.id = json.id;
        monster.name = json.name;
        monster.hp = json.hp;
        monster.damage = json.damage;
        monster.position = json.position;
        return monster;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.hp = this.hp;
        json.damage = this.damage;
        json.position = this.position;
        return json;
    }
}
