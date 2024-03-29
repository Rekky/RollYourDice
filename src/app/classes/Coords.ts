export class Coords {
    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.z = z ? z : 0;
    }

    static fromJSON(json: any): Coords {
        const pos = new Coords();
        pos.x = json.x;
        pos.y = json.y;
        pos.z = json.z;
        return pos;
    }

    toJSON(): any {
        const json: any = {};
        json.x = this.x;
        json.y = this.y;
        json.z = this.z;
        return json;
    }
}
