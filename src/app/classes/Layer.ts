import {Grid} from './Grid';
import {MapObject} from './MapObject';

export class Layer {
    grid: Grid;
    objects: MapObject[];
    opacity: number;
    isActive: boolean;

    constructor(grid?: Grid, isActive?: boolean, opacity?: number, objects?: MapObject[]) {
        this.grid = grid ? grid : new Grid();
        this.objects = objects ? objects : [];
        this.opacity = opacity ? opacity : 100;
        this.isActive = isActive ? isActive : false;
    }

    static fromJSON(json: any): Layer {
        const layer = new Layer();
        layer.grid = Grid.fromJSON(json.grid);
        layer.objects = json.objects;
        layer.opacity = json.opacity;
        layer.isActive = json.isActive;
        return layer;
    }

    toJSON(): any {
        const json: any = {};
        json.grid = this.grid;
        json.objects = this.objects;
        json.opacity = this.opacity;
        json.isActive = this.isActive;
        return json;
    }
}

export class Layers {
     background: Layer;
     objects: Layer;
     gm: Layer;

     constructor(background?: Layer, objects?: Layer, gm?: Layer) {
         this.background = background ? background : new Layer();
         this.objects = objects ? objects : new Layer();
         this.gm = gm ? gm : new Layer();
     }

    static fromJSON(json: any): Layers {
        const layers = new Layers();
        layers.background = Layer.fromJSON(json.background);
        layers.objects = Layer.fromJSON(json.objects);
        layers.gm = Layer.fromJSON(json.gm);
        return layers;
    }

     getActiveLayer(): Layer {
         if (this.background.isActive === true) {
             return this.background;
         }
         if (this.objects.isActive === true) {
             return this.objects;
         }
         if (this.gm.isActive === true) {
             return this.gm;
         }
         return this.background;
     }
}
