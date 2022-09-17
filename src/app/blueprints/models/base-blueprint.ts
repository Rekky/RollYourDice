import {Coords} from '../../classes/Coords';
import {BlueprintLink} from './blueprint-link';

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
    position: Coords;

    constructor() {
        this.id = '';
        this.position = new Coords();
    }

    static create<T extends BaseBlueprintBox>(this: StaticThis<T>, json: BaseBlueprintBox): T {
        return {...new this(), ...json};
    }
}
