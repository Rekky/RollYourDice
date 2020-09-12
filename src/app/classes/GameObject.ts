import {Coords} from './Coords';

export class GameObject {
    id: string;
    name: string;
    position: Coords;

    constructor(id?: string) {
    }
}

export class Character extends GameObject {

    constructor() {
        super();
    }
}
