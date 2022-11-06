import {Coords} from '../../classes/Coords';
import {BlueprintLink, BlueprintNode} from './blueprint-link';
import {ulid} from 'ulid';
import {BBOnInit} from './blueprint-boxes';

export class BlueprintModel {
    id: string;
    blueprintBoxes: {
        onInit: any[];
        onOverlap: any[];
    };

    constructor() {
        this.id = ulid();
        this.blueprintBoxes = {
            onInit: null,
            onOverlap: null,
        };
    }

    fromRendered(rendered: BlueprintRenderedModel): BlueprintModel {
        const blueprint = new BlueprintModel();
        blueprint.id = rendered.id;
        if (rendered.isOnInitActive()) {
            const onInitBox = rendered.getOnInit();
            blueprint.blueprintBoxes.onInit = [onInitBox];
            rendered.buildBoxesPath(onInitBox);
        }
        return blueprint;
    }
}

export class BlueprintRenderedModel {
    id: string;
    blueprintBoxes: BaseBlueprintBox[];
    blueprintLinks: BlueprintLink[];

    constructor() {
        this.id = ulid();
        this.blueprintBoxes = [];
        this.blueprintLinks = [];
    }

    buildBoxesPath(currentBox: BaseBlueprintBox): void {
        const nextBox = this.getNextBox(currentBox);
        if (!nextBox) { return; }
        currentBox.func = nextBox;
        this.buildBoxesPath(nextBox);
    }

    getOnInit(): BBOnInit {
        return this.blueprintBoxes.find(box => {
            return box.kind === BoxKindEnum.ON_INIT && box.type === BoxTypeEnum.EVENT;
        });
    }

    isOnInitActive(): boolean {
        const onInit = this.getOnInit();
        const linkedNode = onInit.render.nodes.endingNodes.find(node => {
            const linked = this.blueprintLinks.find(link => {
                return link.startingNode.id === node.id;
            });
            return linked ? node : null;
        });
        return !!linkedNode;
    }

    getNextBox(currentBox: BaseBlueprintBox): BaseBlueprintBox {
        const linkedNode = this.blueprintLinks.find(link => {
            return link.startingNode.boxId === currentBox.id;
        });
        if (!linkedNode) { return; }
        return this.blueprintBoxes.find(box => {
            return box.id === linkedNode.endingNode.boxId;
        });
    }
}

export type StaticThis<T> = new () => T;

export class BaseBlueprintBox {
    id: string;
    type: string;
    kind: string;
    func?: any;
    param?: any;
    render: {
        position: Coords;
        nodes: {
            startingNodes: BlueprintNode[];
            endingNodes: BlueprintNode[];
        }
    };

    constructor() {
        this.id = ulid();
        this.render = {
            position: new Coords(),
            nodes: {
                startingNodes: [],
                endingNodes: [],
            }
        };
    }

    static create<T extends BaseBlueprintBox>(this: StaticThis<T>, json: BaseBlueprintBox): T {
        return {...new this(), ...json};
    }
}

export enum BoxTypeEnum {
    FUNCTION = 'FUNCTION',
    EVENT = 'EVENT',
}

export enum BoxKindEnum {
    AREA = 'AREA',
    GET_ALL_ACTORS = 'GET_ALL_ACTORS',
    EQUALS = 'EQUALS',
    MOVE_ACTOR_TO_LOCATION = 'MOVE_ACTOR_TO_LOCATION',
    GET = 'GET',
    ON_INIT = 'ON_INIT',
    ON_OVERLAP = 'ON_OVERLAP',
}
