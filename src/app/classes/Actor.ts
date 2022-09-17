import { Health } from './character-properties/health';
import {Player} from './User';
import {OurKonvaImage} from './ourKonva/OurKonvaImage';
import {AssetModel} from './AssetModel';
import { BlueprintModel } from '../blueprints/models/base-blueprint';

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
