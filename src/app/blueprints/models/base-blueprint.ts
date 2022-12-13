import {BlueprintLink} from './blueprint-link';
import {ulid} from 'ulid';
import {
    BaseBlueprintBox,
    BBCountdown, BBGetActors,
    BBOnInit, BBOnOverlap, BBSwitchInteger,
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
        let rendered = new BlueprintRenderedModel();
        rendered.id = blueprint.id;
        if (blueprint?.blueprintBoxes) {
            rendered = this.buildBoxesToRender(blueprint);
        }
        return rendered;
    }

    public buildBoxesToRender(blueprint): BlueprintRenderedModel {
        const rendered = new BlueprintRenderedModel();
        const boxes: BaseBlueprintBox[] = [];
        const links: BlueprintLink[] = [];
        blueprint.blueprintBoxes.onInit.forEach(element => {
            this.buildRenderedBoxes(element, boxes, links);
        });
        rendered.blueprintBoxes = boxes;
        rendered.blueprintLinks = links;
        return rendered;
    }

    buildRenderedBoxes(element, boxes: BaseBlueprintBox[], links: BlueprintLink[]): void {
        if (element.type === BoxTypeEnum.FUNCTION) {
            boxes.push(this.switchGetBBoxFunction(element));
        }
        if (element.type === BoxTypeEnum.EVENT) {
            boxes.push(this.switchGetBBoxEvent(element));
        }
        if (element.type === BoxTypeEnum.OPERATOR) {
            boxes.push(this.switchGetBBoxOperator(element));
        }
        if (element.render.links.length > 0) {
            element.render.links.forEach(link => links.push(BlueprintLink.fromJSON(link)));
            element.func.forEach(func => this.buildRenderedBoxes(func, boxes, links));
        }
    }

    switchGetBBoxFunction(element: any): any {
        switch (element.kind) {
            case BoxKindEnum.COUNTDOWN: {
                return BBCountdown.fromJSON(element);
            }
            case BoxKindEnum.GET_ACTORS: {
                return BBGetActors.fromJSON(element);
            }
        }
    }

    switchGetBBoxEvent(element: any): any {
        switch (element.kind) {
            case BoxKindEnum.ON_INIT: {
                return BBOnInit.fromJSON(element);
            }
            case BoxKindEnum.ON_OVERLAP: {
                return BBOnOverlap.fromJSON(element);
            }
        }
    }

    switchGetBBoxOperator(element: any): any {
        switch (element.kind) {
            case BoxKindEnum.SWITCH_INTEGER: {
                return BBSwitchInteger.fromJSON(element);
            }
        }
    }

    buildBoxesPath(currentBox: BaseBlueprintBox): void {
        const nextBox = this.getNextBox(currentBox);
        if (!nextBox) { return; }
        currentBox.func.length > 0 ? currentBox.func.push(nextBox) : currentBox.func = [nextBox];
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
