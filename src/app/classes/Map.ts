import {Coords} from './Coords';
import {Layers} from './Layer';

export class Map {
    id: string | number;
    name: string | null;
    position: Coords;
    columns: number;
    rows: number;
    fogOfWar: boolean;
    backgroundColor: string;
    mastersDarkness: number;
    dndDiagonalSystem: boolean;
    zoom: number;
    layers: Layers;

    constructor(id?: string | number,
                name?: string,
                position?: Coords,
                columns?: number,
                rows?: number,
                fogOfWar?: boolean,
                backgroundColor?: string,
                mastersDarkness?: number,
                dndDiagonalSystem?: boolean,
                zoom?: number,
                layers?: Layers) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new map';
        this.position = position ? position : new Coords();
        this.columns = columns ? columns : 10;
        this.rows = rows ? rows : 10;
        this.fogOfWar = fogOfWar ? fogOfWar : false;
        this.backgroundColor = backgroundColor ? backgroundColor : 'white';
        this.mastersDarkness = mastersDarkness ? mastersDarkness : 50;
        this.dndDiagonalSystem = dndDiagonalSystem ? dndDiagonalSystem : false;
        this.zoom = zoom ? zoom : 100;
        this.layers = layers ? layers : new Layers();
    }

    static fromJSON(json: any): Map {
        const map = new Map();
        map.id = json.id;
        map.name = json.name;
        map.position = json.position;
        map.columns = json.columns;
        map.rows = json.rows;
        map.fogOfWar = json.fogOfWar;
        map.backgroundColor = json.backgroundColor;
        map.mastersDarkness = json.mastersDarkness;
        map.dndDiagonalSystem = json.dndDiagonalSystem;
        map.zoom = json.zoom;
        map.layers = Layers.fromJSON(json.layers);
        return map;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.position = this.position;
        json.fogOfWar = this.fogOfWar;
        json.backgroundColor = this.backgroundColor;
        json.mastersDarkness = this.mastersDarkness;
        json.dndDiagonalSystem = this.dndDiagonalSystem;
        json.zoom = this.zoom;
        json.layers = this.layers;
        return json;
    }
}
