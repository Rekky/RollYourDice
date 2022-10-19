import Konva from 'konva';

export class OurKonvaLayers {
    objects: Konva.Layer;
    grid: Konva.Layer;
    texts: Konva.Layer;
    draws: Konva.Layer;
    background: Konva.Layer;

    constructor() {
        this.objects = new Konva.Layer();
        this.grid = new Konva.Layer();
        this.texts = new Konva.Layer();
        this.draws = new Konva.Layer();
        this.background = new Konva.Layer();
    }
}
