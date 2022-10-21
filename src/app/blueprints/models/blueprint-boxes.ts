import {BaseBlueprintBox, BoxKindEnum, BoxTypeEnum} from './base-blueprint';
import {BlueprintNode} from './blueprint-link';

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
