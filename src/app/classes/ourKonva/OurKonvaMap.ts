import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import {OurKonvaObject} from './OurKonvaObject';
import Konva from 'konva';
import {OurKonvaLayers} from './OurKonvaLayers';
import { OurKonvaRect } from './OurKonvaRect';
import { OurKonvaText } from './OurKonvaText';
import {Page} from '../Page';
import {Asset} from '../Asset';

export class  OurKonvaMap {
    id: string;
    name: string | null;
    position: Coords;
    columns: number;
    rows: number;
    fogOfWar: boolean;
    backgroundColor: string;
    mastersDarkness: number;
    dndDiagonalSystem: boolean;
    zoom: number;
    grid: OurKonvaGrid;
    objects: (OurKonvaRect | OurKonvaText)[];
    toPlayers: boolean;
    players: string[];
    stage: Konva.Stage;
    layers: OurKonvaLayers;

    constructor() {
        this.id = null;
        this.name = 'new ourKonva';
        this.position = new Coords();
        this.columns = 10;
        this.rows = 10;
        this.fogOfWar = false;
        this.backgroundColor = 'white';
        this.mastersDarkness = 50;
        this.dndDiagonalSystem = false;
        this.zoom = 100;
        this.grid = new OurKonvaGrid();
        this.objects = [];
        this.toPlayers = false;
        this.players = [];
        this.stage = new Konva.Stage({
            container: 'map' + this.id,
            width: this.columns * this.grid.cellSize,
            height: this.rows * this.grid.cellSize
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

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.position = this.position;
        json.columns = this.columns;
        json.rows = this.rows;
        json.fogOfWar = this.fogOfWar;
        json.backgroundColor = this.backgroundColor;
        json.mastersDarkness = this.mastersDarkness;
        json.dndDiagonalSystem = this.dndDiagonalSystem;
        json.zoom = this.zoom;
        json.grid = this.grid;
        json.objects = this.objects;
        json.toPlayers = this.toPlayers;
        json.players = this.players;
        return json;
    }
}
