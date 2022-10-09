import {Coords} from '../../classes/Coords';
import {BlueprintLink, BlueprintNode} from './blueprint-link';
import {ulid} from 'ulid';

export class BlueprintModel {
    blueprintBoxes: BaseBlueprintBox[];
    blueprintLinks: BlueprintLink[];

    constructor() {
        this.blueprintBoxes = [];
        this.blueprintLinks = [];
    }
}

export type StaticThis<T> = new () => T;

export class BaseBlueprintBox {
    id: string;
    type: string;
    kind: string;
    position: Coords;

    constructor() {
        this.id = ulid();
        this.position = new Coords();
    }

    static create<T extends BaseBlueprintBox>(this: StaticThis<T>, json: BaseBlueprintBox): T {
        return {...new this(), ...json};
    }
}

export enum BoxTypeEnum {
    FUNCTION = 'FUNCTION'
}

export enum BoxKindEnum {
    AREA = 'AREA',
    GET_ALL_ACTORS = 'GET_ALL_ACTORS',
    EQUALS = 'EQUALS',
    MOVE_ACTOR_TO_LOCATION = 'MOVE_ACTOR_TO_LOCATION',
    GET = 'GET',
}
