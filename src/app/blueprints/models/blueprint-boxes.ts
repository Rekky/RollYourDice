import {BlueprintNode, BlueprintNodeType} from './blueprint-link';
import {Coords} from '../../classes/Coords';
import {ulid} from 'ulid';
import {ActorTypesEnum} from '../../classes/Actor';
import {render} from 'ngx-color';

export type StaticThis<T> = new () => T;

export class BaseBlueprintBox {
    id: string;
    type: string;
    kind: string;
    func: any[];
    param?: any;
    render: {
        position: Coords;
        nodes: {
            startingNodes: BlueprintNode[];
            endingNodes: BlueprintNode[];
        }
        links: any[];
    };

    constructor() {
        this.id = ulid();
        this.func = [];
        this.render = {
            position: new Coords(),
            nodes: {
                startingNodes: [],
                endingNodes: [],
            },
            links: [],
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

    static fromJSON(json): BBOnInit {
        const bb = new BBOnInit();
        bb.id = json.id;
        bb.render = json.render;
        return bb;
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

    static fromJSON(json): BBOnOverlap {
        const bb = new BBOnOverlap();
        bb.id = json.id;
        bb.render = json.render;
        return bb;
    }
}

export class BBCountdown extends BaseBlueprintBox {
    seconds: number;
    isLoop: boolean;

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.COUNTDOWN;
        this.seconds = 1;
        this.isLoop = false;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }

    static fromJSON(json): BBCountdown {
        const countdown = new BBCountdown();
        countdown.id = json.id;
        countdown.seconds = json.seconds;
        countdown.isLoop = json.isLoop;
        countdown.render = json.render;
        return countdown;
    }
}

export class BBGetActors extends BaseBlueprintBox {
    filters: {
        type: ActorTypesEnum,
        tag: string[],
    };

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.GET_ACTORS;
        this.filters = {
            type: null,
            tag: []
        };
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }

    static fromJSON(json): BBGetActors {
        const bb = new BBGetActors();
        bb.id = json.id;
        bb.render = json.render;
        bb.filters = json.filters;
        return bb;
    }
}

export class BBGetPlayers extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.GET_PLAYERS;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }

    static fromJSON(json): BBGetPlayers {
        const bb = new BBGetPlayers();
        bb.id = json.id;
        bb.render = json.render;
        return bb;
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
            type: BlueprintNodeType.DATA,
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
        }));
    }

    static fromJSON(json): BBSwitchInteger {
        const bb = new BBSwitchInteger();
        bb.id = json.id;
        bb.render = json.render;
        bb.integer = json.integer;
        return bb;
    }
}

export class BBForEachLoop extends BaseBlueprintBox {
    nTimes: number;

    constructor() {
        super();
        this.type = BoxTypeEnum.OPERATOR;
        this.kind = BoxKindEnum.FOR_EACH_LOOP;
        this.nTimes = 0;
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
            title: 'Exec',
        }));
        this.render.nodes.startingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
            type: BlueprintNodeType.DATA,
            title: 'Array',
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
            title: 'Loop',
        }));
        this.render.nodes.endingNodes.push(BlueprintNode.fromJSON({
            boxId: this.id,
            title: 'Completed',
        }));
    }

    static fromJSON(json): BBForEachLoop {
        const bb = new BBForEachLoop();
        bb.id = json.id;
        bb.render = json.render;
        bb.nTimes = json.nTimes;
        return bb;
    }
}

export enum BoxTypeEnum {
    FUNCTION = 'FUNCTION',
    EVENT = 'EVENT',
    OPERATOR = 'OPERATOR'
}

export enum BoxKindEnum {
    ON_INIT = 'ON_INIT',
    ON_OVERLAP = 'ON_OVERLAP',
    COUNTDOWN = 'COUNTDOWN',
    GET_ACTORS = 'GET_ACTORS',
    GET_PLAYERS = 'GET_PLAYERS',
    SWITCH_INTEGER = 'SWITCH_INTEGER',
    FOR_EACH_LOOP = 'FOR_EACH_LOOP',
}
