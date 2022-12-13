import {BlueprintNode} from './blueprint-link';
import {Coords} from '../../classes/Coords';
import {ulid} from 'ulid';

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

export class BBOnInit extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.EVENT;
        this.kind = BoxKindEnum.ON_INIT;
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }
}

export class BBOnOverlap extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.EVENT;
        this.kind = BoxKindEnum.ON_OVERLAP;
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }
}

export class BBArea extends BaseBlueprintBox {
    name: string;

    constructor() {
        super();
        this.name = 'namesito';
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.AREA;
    }
}

export class BBGetAllActors extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.GET_ALL_ACTORS;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }


}

export class BBEquals extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.EQUALS;
    }
}

export class BBMoveActorToLocation extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.MOVE_ACTOR_TO_LOCATION;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }
}

export class BBGet extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.GET;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }
}

export class BBCountdown extends BaseBlueprintBox {
    seconds: number;
    isLoop: boolean;

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.COUNTDOWN;
        this.seconds = 0;
        this.isLoop = false;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }
}

export class BBSwitchInteger extends BaseBlueprintBox {
    integer: number;

    constructor() {
        super();
        this.type = BoxTypeEnum.OPERATOR;
        this.kind = BoxKindEnum.SWITCH_INTEGER;
        this.integer = 0;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }
}

export enum BoxTypeEnum {
    FUNCTION = 'FUNCTION',
    EVENT = 'EVENT',
    OPERATOR = 'OPERATOR'
}

export enum BoxKindEnum {
    AREA = 'AREA',
    GET_ALL_ACTORS = 'GET_ALL_ACTORS',
    EQUALS = 'EQUALS',
    MOVE_ACTOR_TO_LOCATION = 'MOVE_ACTOR_TO_LOCATION',
    GET = 'GET',
    COUNTDOWN = 'COUNTDOWN',
    ON_INIT = 'ON_INIT',
    ON_OVERLAP = 'ON_OVERLAP',
    SWITCH_INTEGER = 'SWITCH_INTEGER'
}
