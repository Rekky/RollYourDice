import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import Konva from 'konva';
import {OurKonvaLayers} from './OurKonvaLayers';
import { OurKonvaRect } from './OurKonvaRect';
import { OurKonvaText } from './OurKonvaText';
import {Asset} from '../Asset';
import {OurKonvaImage} from './OurKonvaImage';
import { ulid } from 'ulid';

export class  OurKonvaMap {
    id: string;
    name: string | null;
    position: Coords;
    nColumns: number;
    nRows: number;
    isFogOfWar: boolean;
    backgroundColor: string;
    backgroundImage: Asset | null;
    nFogOfWarPercent: number;
    isDndDiagonalSystem: boolean;
    nZoom: number;
    grid: OurKonvaGrid;
    objects: (OurKonvaRect | OurKonvaText | OurKonvaImage)[];
    characters: string[];
    stage: Konva.Stage;
    layers: OurKonvaLayers;

    constructor() {
        this.id = ulid();
        this.name = 'New map';
        this.position = new Coords();
        this.nColumns = 50;
        this.nRows = 50;
        this.isFogOfWar = false;
        this.backgroundColor = '#F2F2F2';
        this.backgroundImage = null;
        this.nFogOfWarPercent = 50;
        this.isDndDiagonalSystem = false;
        this.nZoom = 100;
        this.grid = new OurKonvaGrid();
        this.objects = [];
        this.characters = [];
        // this.stage = new Konva.Stage({
        //     container: 'map' + this.id,
        //     width: this.nColumns * this.grid.cellSize,
        //     height: this.nRows * this.grid.cellSize
        // });
        this.layers = new OurKonvaLayers();
    }

    static fromJSON(json: any): OurKonvaMap {
        const map = new OurKonvaMap();
        Object.keys(map).forEach((key) => {
            map[key] = json[key] ? json[key] : map[key];
        });
        map.grid = json.grid ? OurKonvaGrid.fromJSON(json.grid) : map.grid;
        return map;
    }
}

export class OurKonvaMapModification {
    type: string;
    object: any;
    mapId: string;

    constructor() {
        this.type = null;
        this.object = null;
        this.mapId = null;
    }

    static generateModification(type: string, data: any): OurKonvaMapModification {
        const mod = new OurKonvaMapModification();
        mod.type = type;
        mod.object = data.object;
        mod.mapId = data.mapId;
        return mod;
    }
}
