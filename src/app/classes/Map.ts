import {Grid} from './Grid';
import {Coords} from './Coords';

export class Map {
    id: string | number;
    name: string | null;
    grid: Grid;
    position: Coords;
    columns: number;
    rows: number;
    fogOfWar: boolean;
    backgroundColor: string;
    mastersDarkness: number;
    dndDiagonalSystem: boolean;
    zoom: number;

    constructor(id?: string,
                name?: string,
                grid?: Grid,
                position?: Coords,
                columns?: number,
                rows?: number,
                fogOfWar?: boolean,
                backgroundColor?: string,
                mastersDarkness?: number,
                dndDiagonalSystem?: boolean,
                zoom?: number) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.name = name ? name : 'new map';
        this.grid = grid ? grid : new Grid();
        this.position = position ? position : new Coords();
        this.columns = columns ? columns : 10;
        this.rows = rows ? rows : 10;
        this.fogOfWar = fogOfWar ? fogOfWar : false;
        this.backgroundColor = backgroundColor ? backgroundColor : 'white';
        this.mastersDarkness = mastersDarkness ? mastersDarkness : 50;
        this.dndDiagonalSystem = dndDiagonalSystem ? dndDiagonalSystem : false;
        this.zoom = zoom ? zoom : 100;
    }

    static fromJSON(json: any): Map {
        const map = new Map();
        map.id = json.id;
        map.name = json.name;
        map.grid = Grid.fromJSON(json.grid);
        map.position = json.position;
        map.columns = json.columns;
        map.rows = json.rows;
        map.fogOfWar = json.fogOfWar;
        map.backgroundColor = json.backgroundColor;
        map.mastersDarkness = json.mastersDarkness;
        map.dndDiagonalSystem = json.dndDiagonalSystem;
        map.zoom = json.zoom;
        return map;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.name = this.name;
        json.grid = this.grid;
        json.position = this.position;
        json.fogOfWar = this.fogOfWar;
        json.backgroundColor = this.backgroundColor;
        json.mastersDarkness = this.mastersDarkness;
        json.dndDiagonalSystem = this.dndDiagonalSystem;
        json.zoom = this.zoom;
        return json;
    }
}
