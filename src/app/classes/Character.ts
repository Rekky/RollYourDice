import {Actor} from './Actor';

export class Character extends Actor {
    armor: number;
    experience: number;
    initiative: number;
    level: number;
    magicPoints: number;
    magicResist: number;
    movementSpeed: number;

    constructor() {
        super();
    }
}
