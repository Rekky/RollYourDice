import {Coords} from '../../classes/Coords';
import {BlueprintLink, BlueprintNode} from './blueprint-link';
import {ulid} from 'ulid';

export class BlueprintModel {
    id: string;
    blueprintBoxes: BaseBlueprintBox[];
    blueprintLinks: BlueprintLink[];

    constructor() {
        this.id = ulid();
        this.blueprintBoxes = [];
        this.blueprintLinks = [];
    }
}

export type StaticThis<T> = new () => T;

export class BaseBlueprintBox {
    id: string;
    type: string;
    kind: string;
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
