import {GameObject} from './GameObject';

export class Character extends GameObject {
    hp: number;
    damage: number;

    constructor(hp?: number,
                damage?: number) {
        super();
        this.hp = hp ? hp : 100;
        this.damage = damage ? damage : 10;
    }
}
