import { Health } from './character-properties/health';
import {Player} from './User';
import {OurKonvaImage} from './ourKonva/OurKonvaImage';
import {AssetModel} from './AssetModel';
import {Coords} from './Coords';

export class Actor {
    id: string;
    hp: Health;
    name: string;
    asset: AssetModel;
    author: Player;

    blueprint: BlueprintModel;
    mapRepresentation: OurKonvaImage;

    constructor() {
        this.blueprint = new BlueprintModel();
    }
}

export class BlueprintModel {
    position: Coords;

    constructor() {
        this.position = new Coords();
    }
}
