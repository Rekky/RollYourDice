import {BaseBlueprintBox, BoxKindEnum, BoxTypeEnum} from './base-blueprint';

export class BBArea extends BaseBlueprintBox {
    name: string;

    constructor() {
        super();
        this.name = 'namesito';
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.AREA;
    }
}
