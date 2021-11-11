import {Coords} from '../Coords';

export class OurKonvaGrid {
    cellSize: number;
    opacity: number;
    color: string;
    squareFeet: number;

    constructor(
        cellSize?: number,
        opacity?: number,
        color?: string,
        squareFeet?: number) {
        this.cellSize = cellSize ? cellSize : 100;
        this.opacity = opacity ? opacity : 100;
        this.color = color ? color : 'black';
        this.squareFeet = squareFeet ? squareFeet : 5;
    }

    static fromJSON(json: any): OurKonvaGrid {
        const grid = new OurKonvaGrid();
        grid.cellSize = json.cellSize;
        grid.opacity = json.opacity;
        grid.color = json.color;
        grid.squareFeet = json.squareFeet;
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
        json.color = this.color;
        json.squareFeet = this.squareFeet;
        return json;
    }


}
