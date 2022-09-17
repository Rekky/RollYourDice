import {BaseBlueprintBox} from './base-blueprint';

export class BBArea extends BaseBlueprintBox {
    name: string;

    constructor() {
        super();
        this.name = 'namesito';
        this.type = 'area';
    }
}
