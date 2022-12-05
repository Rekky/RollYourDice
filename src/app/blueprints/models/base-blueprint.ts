import {BlueprintLink} from './blueprint-link';
import {ulid} from 'ulid';
import {
    BaseBlueprintBox, BBArea,
    BBEquals,
    BBGet,
    BBGetAllActors,
    BBMoveActorToLocation,
    BBOnInit, BBOnOverlap,
    BoxKindEnum,
    BoxTypeEnum
} from './blueprint-boxes';

export class BlueprintModel {
    id: string;
    blueprintBoxes: {
        onInit: any[];
        onOverlap: any[];
    };

    constructor() {
        this.id = ulid();
        this.blueprintBoxes = {
            onInit: null,
            onOverlap: null,
        };
    }

    fromRendered(rendered: BlueprintRenderedModel): BlueprintModel {
        const blueprint = new BlueprintModel();
        blueprint.id = rendered.id;
        if (rendered.isOnInitActive()) {
            const onInitBox = rendered.getOnInit();
            blueprint.blueprintBoxes.onInit = [onInitBox];
            rendered.buildBoxesPath(onInitBox);
        }
        return blueprint;
    }
}

export class BlueprintRenderedModel {
    id: string;
    blueprintBoxes: BaseBlueprintBox[];
    blueprintLinks: BlueprintLink[];

    constructor() {
        this.id = ulid();
        this.blueprintBoxes = [];
        this.blueprintLinks = [];
    }

    toRendered(blueprint: BlueprintModel): BlueprintRenderedModel {
        const rendered = new BlueprintRenderedModel();
        rendered.id = blueprint.id;
        if (blueprint?.blueprintBoxes) {
            rendered.blueprintBoxes = this.buildBoxesToRender(blueprint);
        }
        return rendered;
    }

    public buildBoxesToRender(blueprint): any[] {
        const boxes = [];
        blueprint.blueprintBoxes.onInit.forEach(element => {
            // TODO construir la caixa que pertoca
            this.test(element, boxes);
        });
        return boxes;
    }

    test(element, boxes): void {
        if (element.type === BoxTypeEnum.FUNCTION) {
            boxes.push(this.switchGetBBox(element));
        }
        if (element.type === BoxTypeEnum.EVENT) {
            boxes.push(this.buildEventBox(element));
        }
        if (element.func) {
            this.test(element.func, boxes);
        }
    }

    switchGetBBox(element: any): any {
        switch (element.kind) {
            case BoxKindEnum.GET_ALL_ACTORS: {
                return { ...new BBGetAllActors(), ...element };
            }
            case BoxKindEnum.GET: {
                return { ...new BBGet(), ...element };
            }
            case BoxKindEnum.EQUALS: {
                return { ...new BBEquals(), ...element };
            }
            case BoxKindEnum.MOVE_ACTOR_TO_LOCATION: {
                return { ...new BBMoveActorToLocation(), ...element };
            }
            case BoxKindEnum.AREA: {
                return { ...new BBArea(), ...element };
            }
        }
    }

    buildEventBox(element: any): any {
        switch (element.kind) {
            case BoxKindEnum.ON_INIT: {
                return { ...new BBOnInit(), ...element };
            }
            case BoxKindEnum.ON_OVERLAP: {
                return { ...new BBOnOverlap(), ...element };
            }
        }
    }

    buildBoxesPath(currentBox: BaseBlueprintBox): void {
        const nextBox = this.getNextBox(currentBox);
        if (!nextBox) { return; }
        currentBox.func = nextBox;
        this.buildBoxesPath(nextBox);
    }

    getOnInit(): BBOnInit {
        return this.blueprintBoxes.find(box => {
            return box.kind === BoxKindEnum.ON_INIT && box.type === BoxTypeEnum.EVENT;
        });
    }

    isOnInitActive(): boolean {
        const onInit = this.getOnInit();
        const linkedNode = onInit.render.nodes.endingNodes.find(node => {
            const linked = this.blueprintLinks.find(link => {
                return link.startingNode.id === node.id;
            });
            return linked ? node : null;
        });
        return !!linkedNode;
    }

    getNextBox(currentBox: BaseBlueprintBox): BaseBlueprintBox {
        const linkedNode = this.blueprintLinks.find(link => {
            return link.startingNode.boxId === currentBox.id;
        });
        if (!linkedNode) { return; }
        return this.blueprintBoxes.find(box => {
            return box.id === linkedNode.endingNode.boxId;
        });
    }
}
