import {Coords} from '../../classes/Coords';
import {BlueprintLink, BlueprintNode} from './blueprint-link';

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
        this.id = '';
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
    AREA = 'AREA'
}
