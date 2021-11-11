import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import {OurKonvaObject} from './OurKonvaObject';
import Konva from 'konva';
import {OurKonvaLayers} from './OurKonvaLayers';
import { OurKonvaRect } from './OurKonvaRect';
import { OurKonvaText } from './OurKonvaText';
import {Asset} from '../Asset';
import {OurKonvaImage} from './OurKonvaImage';

export class  OurKonvaMap {
    id: string | null;
    name: string | null;
    position: Coords;
    nColumns: number;
    nRows: number;
    fogOfWar: boolean;
    backgroundColor: string;
    backgroundImage: string | null;
    mastersDarkness: number;
    dndDiagonalSystem: boolean;
    zoom: number;
    grid: OurKonvaGrid;
    objects: (OurKonvaRect | OurKonvaText | OurKonvaImage)[];
    toPlayers: boolean;
    players: string[];
    stage: Konva.Stage;
    layers: OurKonvaLayers;

    constructor() {
        this.id = null;
        this.name = 'new ourKonva';
        this.position = new Coords();
        this.nColumns = 10;
        this.nRows = 10;
        this.fogOfWar = false;
        this.backgroundColor = 'white';
        this.backgroundImage = null;
        this.mastersDarkness = 50;
        this.dndDiagonalSystem = false;
        this.zoom = 100;
        this.grid = new OurKonvaGrid();
        this.objects = [];
        this.toPlayers = false;
        this.players = [];
        this.stage = new Konva.Stage({
            container: 'map' + this.id,
            width: this.nColumns * this.grid.cellSize,
            height: this.nRows * this.grid.cellSize
        });
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
