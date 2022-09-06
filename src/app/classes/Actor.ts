import { Health } from './character-properties/health';
import {Player} from './User';
import {OurKonvaImage} from './ourKonva/OurKonvaImage';
import {OurKonvaObject} from './ourKonva/OurKonvaObject';
import {AssetModel} from './AssetModel';
import Konva from 'konva';
import {OurKonvaRect} from './ourKonva/OurKonvaRect';
import {Coords} from './Coords';

export class Actor {
    asset: AssetModel;
    author: Player;
    blueprint: BlueprintModel;
    healthPoints: Health;
    id: string;
    mapRepresentation: OurKonvaImage;
    name: string;

    constructor() {
        this.blueprint = new BlueprintModel();
    }
}

export class BlueprintModel {
    blueprintBoxes: BBArea[];

    constructor() {
        this.blueprintBoxes = [];
    }
}

export class BlueprintBox {
    id: string;
    type: string;
    position: Coords;

    constructor() {
        this.id = '';
        this.position = new Coords();
    }
}

export class BBArea extends BlueprintBox {
    name: string;

    constructor() {
        super();
        this.name = 'Area box';
        this.type = 'area';
    }
}
