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

export class BBGetAllActors extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.GET_ALL_ACTORS;
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
    }
}

export class BBGet extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.FUNCTION;
        this.kind = BoxKindEnum.GET;
    }
}

export class BBOnInit extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.EVENT;
        this.kind = BoxKindEnum.ON_INIT;
    }
}

export class BBOnOverlap extends BaseBlueprintBox {

    constructor() {
        super();
        this.type = BoxTypeEnum.EVENT;
        this.kind = BoxKindEnum.ON_OVERLAP;
    }
}
