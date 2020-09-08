import Konva from 'konva';

export class Mouse {
    isActive: boolean;
    stage: Konva.Stage;
    layer: Konva.Layer;
    state: string;
    ev: MouseEvent;

    constructor(stage?: Konva.Stage, layer?: Konva.Layer, ev?: MouseEvent, isActive?: boolean) {
        this.isActive = isActive ? isActive : false;
        this.stage = stage ? stage : null;
        this.layer = layer ? layer : null;
        this.ev = ev ? ev : null;
    }

    mouseDown(): void | CurrentSelectedObject {}
    mouseMove(): void {}
    mouseUp(): void {}
    mouseOut(): void {}
}

export class CurrentSelectedObject {
    transformer: Konva.Transformer;
    attr: any;

    constructor(tr: Konva.Transformer, attr: any) {
        this.transformer = tr;
        this.attr = attr;
    }
}
