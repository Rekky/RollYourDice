import {Actor} from './Actor';

export class Monster extends Actor {

    constructor() {
        super();
    }

    // static fromJSON(json: any): Monster {
    //     const monster = new Monster();
    //     monster.name = json.name;
    //     monster.hp = json.hp;
    //     return monster;
    // }
    //
    // toJSON(): any {
    //     const json: any = {};
    //     json.name = this.name;
    //     json.hp = this.hp;
    //     return json;
    // }
}
