import {Coords} from '../../classes/Coords';
import {ulid} from 'ulid';

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

    controlLinkPosition(): void {
        this.position.x = Math.min(this.startingNode.position.x, this.endingNode.position.x);
        this.position.y = Math.min(this.startingNode.position.y, this.endingNode.position.y);
    }
}

export class BlueprintNode {
    position: Coords;
    boxId: string;
    id: string;

    constructor() {
        this.position = new Coords();
        this.boxId = '';
        this.id = ulid();
    }
}
