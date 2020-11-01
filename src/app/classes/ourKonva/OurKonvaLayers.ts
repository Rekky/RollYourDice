import Konva from 'konva';

export class OurKonvaLayers {
    grid: Konva.Layer;
    objects: Konva.Layer;
    draws: Konva.Layer;
    shapes: Konva.Layer;
    shadows: Konva.Layer;

    constructor() {
        this.grid = new Konva.Layer();
        this.objects = new Konva.Layer();
        this.draws = new Konva.Layer();
        this.shapes = new Konva.Layer();
        this.shadows = new Konva.Layer();
    }
}
