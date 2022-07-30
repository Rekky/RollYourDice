import { Health } from './character-properties/health';
import {Player} from './User';
import {OurKonvaImage} from './ourKonva/OurKonvaImage';
import {OurKonvaObject} from './ourKonva/OurKonvaObject';
import {AssetModel} from './AssetModel';
import Konva from 'konva';
import {OurKonvaRect} from './ourKonva/OurKonvaRect';

export class Actor {
    asset: AssetModel;
    author: Player;
    healthPoints: Health;
    id: string;
    mapRepresentation: OurKonvaImage;
    name: string;

    constructor() {}
}
