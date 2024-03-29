import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import Konva from 'konva';
import {OurKonvaLayers} from './OurKonvaLayers';
import { OurKonvaRect } from './OurKonvaRect';
import { OurKonvaText } from './OurKonvaText';
import {OurKonvaImage} from './OurKonvaImage';
import { ulid } from 'ulid';
import {Camera} from '../Camera';
import {OurKonvaBrush} from './OurKonvaBrush';
import {AssetModel} from '../AssetModel';
import {Actor} from '../Actor';

export class  OurKonvaMap {
    id: string;
    name: string | null;
    position: Coords;
    nColumns: number;
    nRows: number;
    backgroundColor: string;
    grid: OurKonvaGrid;
    isFogOfWar: boolean;
    nFogOfWarPercent: number;
    isDndDiagonalSystem: boolean;
    nZoom: number;
    cameras: Camera[];
    objects: (AssetModel | Actor)[];
    characters: string[];
    stage: Konva.Stage | any;
    layers: OurKonvaLayers;

    constructor() {
        this.id = ulid();
        this.name = 'New map';
        this.position = new Coords();
        this.nColumns = 50;
        this.nRows = 50;
        this.isFogOfWar = false;
        this.backgroundColor = '#333333';
        this.nFogOfWarPercent = 50;
        this.isDndDiagonalSystem = false;
        this.nZoom = 100;
        this.grid = new OurKonvaGrid();
        this.objects = [];
        this.characters = [];
        this.cameras = [
            {id: '1233123', name: 'Camera Test 1', x: 0, y: 0, width: 10, height: 50, active: false },
            {id: '567657', name: 'Camera Test 2', x: 110, y: 10, width: 100, height: 100, active: false },
        ];
        this.stage = {
            attrs: {height: 100, width: 100, x: 0, y: 0, scaleX: 1, scaleY: 1}
        };
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
    objects: any;
    mapId: string;

    constructor() {
        this.type = null;
        this.objects = null;
        this.mapId = null;
    }

    static generateModification(type: string, data: any): OurKonvaMapModification {
        const mod = new OurKonvaMapModification();
        mod.type = type;
        mod.objects = data.objects;
        mod.mapId = data.mapId;
        return mod;
    }
}
