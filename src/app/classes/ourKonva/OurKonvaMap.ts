import {Coords} from '../Coords';
import {OurKonvaGrid} from './OurKonvaGrid';
import {OurKonvaObject} from './OurKonvaObject';

export class OurKonvaMap {
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
    objects: OurKonvaObject[];

    constructor(id?: string,
                name?: string,
                position?: Coords,
                columns?: number,
                rows?: number,
                fogOfWar?: boolean,
                backgroundColor?: string,
                mastersDarkness?: number,
                dndDiagonalSystem?: boolean,
                zoom?: number,
                grid?: OurKonvaGrid,
                objects?: OurKonvaObject[]) {
        this.id = id ? id : null;
        this.name = name ? name : 'new ourKonva';
        this.position = position ? position : new Coords();
        this.columns = columns ? columns : 10;
        this.rows = rows ? rows : 10;
        this.fogOfWar = fogOfWar ? fogOfWar : false;
        this.backgroundColor = backgroundColor ? backgroundColor : 'white';
        this.mastersDarkness = mastersDarkness ? mastersDarkness : 50;
        this.dndDiagonalSystem = dndDiagonalSystem ? dndDiagonalSystem : false;
        this.zoom = zoom ? zoom : 100;
        this.grid = grid ? grid : new OurKonvaGrid();
        this.objects = objects ? objects : [];
    }

    static fromJSON(json: any): OurKonvaMap {
        const map = new OurKonvaMap();
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
        map.grid = OurKonvaGrid.fromJSON(json.grid);
        map.objects = json.objects;
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
        return json;
    }
}
