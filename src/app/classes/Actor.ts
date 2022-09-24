import { Health } from './character-properties/health';
import {Player} from './User';
import {OurKonvaImage} from './ourKonva/OurKonvaImage';
import {AssetModel} from './AssetModel';
import {Coords} from './Coords';
import { BlueprintModel } from '../blueprints/models/base-blueprint';

export enum ActorTypesEnum {
    CHARACTER = 'CHARACTER',
    MONSTER = 'MONSTER',
    NPC = 'NPC',
    OBJECT = 'OBJECT',
    SPELL = 'SPELL',
    PET = 'PET',
    UNKNOWN = 'UNKNOWN'
}

export class Actor {
    id: string;
    hp: Health;
    name: string;
    type: ActorTypesEnum;
    asset: AssetModel;
    author: Player;

    blueprint: BlueprintModel;
    mapRepresentation: OurKonvaImage;

    constructor() {
        this.blueprint = new BlueprintModel();
    }
}

export class CHARACTER extends Actor {
    armor: number;
    experience: number;
    initiative: number;
    level: number;
    magicPoints: number;
    magicResist: number;
    movementSpeed: number;
    movementSteps: number;

    constructor() {
        super();
        this.type = ActorTypesEnum.CHARACTER;
    }
}

export class MONSTER extends Actor {
    level: number;
    movementSteps: number;

    constructor() {
        super();
        this.type = ActorTypesEnum.MONSTER;
    }
}

export class NPC extends Actor {

    constructor() {
        super();
    }
}

export class OBJECT extends Actor {

    constructor() {
        super();
    }

}


export class SPELL extends Actor {

    constructor() {
        super();
    }

}

export class PET extends Actor {

    constructor() {
        super();
    }

}
