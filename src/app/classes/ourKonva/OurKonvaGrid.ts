import {Coords} from '../Coords';

export class OurKonvaGrid {
    cellSize: number;
    opacity: number;
    stroke: string;
    squareFeet: number;
    strokeSize: number;

    constructor(
        cellSize?: number,
        opacity?: number,
        stroke?: string,
        squareFeet?: number,
        strokeSize?: number) {
        this.cellSize = cellSize ? cellSize : 40;
        this.opacity = opacity ? opacity : 100;
        this.stroke = stroke ? stroke : '#e6e6e6';
        this.squareFeet = squareFeet ? squareFeet : 5;
        this.strokeSize = strokeSize ? strokeSize : 1;
    }

    static fromJSON(json: any): OurKonvaGrid {
        const grid = new OurKonvaGrid();
        grid.cellSize = json.cellSize;
        grid.opacity = json.opacity;
        grid.stroke = json.stroke;
        grid.squareFeet = json.squareFeet;
        grid.strokeSize = json.strokeSize;
        return grid;
    }

    static correctPosition(pos: Coords, cellSize: number): Coords {
        const position = new Coords();
        position.x = Math.round(pos.x / cellSize) * cellSize;
        position.y = Math.round(pos.y / cellSize) * cellSize;
        return position;
    }

    toJSON(): any {
        const json: any = {};
        json.cellSize = this.cellSize;
        json.opacity = this.opacity;
        json.stroke = this.stroke;
        json.squareFeet = this.squareFeet;
        json.strokeSize = this.strokeSize;
        return json;
    }


}
