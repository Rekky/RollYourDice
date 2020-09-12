import {Coords} from './Coords';
import {Character} from './Character';

export class Monster extends Character {

    constructor() {
        super();
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
