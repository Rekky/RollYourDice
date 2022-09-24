import {Coords} from '../../classes/Coords';

export class BlueprintLink {
    id: string;
    position: Coords;
    startingNode: BlueprintNode;
    endingNode: BlueprintNode;
    stroke: string;
    strokeWidth: number;

    constructor() {
        this.id = '';
        this.position = new Coords();
        this.startingNode = new BlueprintNode();
        this.endingNode = new BlueprintNode();
        this.stroke = 'white';
        this.strokeWidth = 2;
    }
}

export class BlueprintNode {
    id: string;
    position: Coords;
    fill: string;

    constructor() {
        this.id = '';
        this.position = new Coords();
        this.fill = 'yellow';
    }
}
