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
        this.id = ulid();
        this.position = new Coords();
        this.startingNode = new BlueprintNode();
        this.endingNode = new BlueprintNode();
        this.stroke = 'white';
        this.strokeWidth = 2;
    }

    static fromJSON(json: any): BlueprintLink {
        const link = new BlueprintLink();
        link.id = json.id;
        link.position = json.position;
        link.stroke = json.stroke;
        link.strokeWidth = json.strokeWidth;
        link.startingNode = BlueprintNode.fromJSON(json.startingNode);
        link.endingNode = BlueprintNode.fromJSON(json.endingNode);
        return link;
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
    type: BlueprintNodeType;

    constructor() {
        this.position = new Coords();
        this.boxId = '';
        this.id = ulid();
        this.type = BlueprintNodeType.LIFE_CYCLE;
    }

    static fromJSON(json: any): BlueprintNode {
        const node = new BlueprintNode();
        node.id = json.id ? json.id : node.id;
        node.boxId = json.boxId;
        node.type = json.type;
        if (json.position) {
            node.position = Coords.fromJSON(json.position);
        }
        return node;
    }
}

export enum BlueprintNodeType {
    LIFE_CYCLE = 'LIFE_CYCLE',
    DATA = 'DATA',
}
