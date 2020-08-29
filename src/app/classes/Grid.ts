import {Position} from './Position';

export class Grid {
    cellSize: number;
    opacity: number;
    color: string;
    squareFeet: number;

    constructor(
        cellSize?: number,
        opacity?: number,
        color?: string,
        squareFeet?: number) {
        this.cellSize = cellSize ? cellSize : 40;
        this.opacity = opacity ? opacity : 100;
        this.color = color ? color : 'black';
        this.squareFeet = squareFeet ? squareFeet : 5;
    }

    static fromJSON(json: any): Grid {
        const grid = new Grid();
        grid.cellSize = json.cellSize;
        grid.opacity = json.opacity;
        grid.color = json.color;
        grid.squareFeet = json.squareFeet;
        return grid;
    }

    static correctPosition(pos: Position, cellSize: number): Position {
        const position = new Position();
        position.x = Math.round(pos.x / cellSize) * cellSize;
        position.y = Math.round(pos.y / cellSize) * cellSize;
        return position;
    }

    toJSON(grid: Grid): any {
        const json: any = {};
        json.cellSize = grid.cellSize;
        json.opacity = grid.opacity;
        json.color = grid.color;
        json.squareFeet = grid.squareFeet;
        return grid;
    }


}
