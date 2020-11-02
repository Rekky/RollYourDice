import Konva from 'konva';

export class OurKonvaLayers {
    objects: Konva.Layer;
    grid: Konva.Layer;
    shadows: Konva.Layer;
    draws: Konva.Layer;
    texts: Konva.Layer;

    constructor() {
        this.objects = new Konva.Layer();
        this.grid = new Konva.Layer();
        this.shadows = new Konva.Layer();
        this.draws = new Konva.Layer();
        this.texts = new Konva.Layer();
    }
}
