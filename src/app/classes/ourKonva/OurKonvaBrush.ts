import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaObject} from './OurKonvaObject';
import {Player} from '../User';
import {ulid} from 'ulid';
import {Coords} from '../Coords';
import {OurKonvaLayers} from './OurKonvaLayers';
import {OurKonvaScale, OurKonvaSize} from './OurKonvaSize';

export class OurKonvaBrush extends OurKonvaObject {
    id: string;
    position: Coords;
    type: string = 'brush';
    line: Konva.Line;
    points: number[];
    stroke: string;
    strokeWidth: number;
    minPos: Coords;
    strokeScaleEnabled: boolean;

    constructor(author: Player) {
        super(author);
        this.id = ulid();
        this.position = new Coords();
        this.line = new Konva.Line();
        this.stroke = '#E2F24B';
        this.strokeWidth = 5;
        this.points = [];
        this.minPos = new Coords();
        this.strokeScaleEnabled = false;
    }

    static paint(object: OurKonvaBrush, layer: Konva.Layer): CurrentSelectedKonvaObject {
        const line = new Konva.Line({
            id: object.id,
            stroke: object.stroke,
            strokeWidth: object.strokeWidth,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
            points: object.points,
            x: object.position.x,
            y: object.position.y,
            draggable: false,
            scaleX: object.scale.x,
            scaleY: object.scale.y,
            strokeScaleEnabled: false,
        });

        layer.add(line);
        object.layer = layer;
        layer.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = object;
        toEmit.konvaObject = line;
        toEmit.type = object.type;
        toEmit.layer = layer;
        return toEmit;
    }

    mouseDown(layers: OurKonvaLayers): void {
        super.mouseDown(layers);
        this.position = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
        this.line = new Konva.Line({
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
            points: [0, 0],
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            draggable: false,
            strokeScaleEnabled: false,
        });
        this.layer = layers.draws;
        this.layer.add(this.line);
        this.minPos = new Coords(this.position.x, this.position.y);
    }

    mouseMove(): void {
        super.mouseMove();
        if (this.isActive) {
            const pos = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
            const newPos = new Coords(pos.x - this.position.x, pos.y - this.position.y);
            const newPoints = this.line.points().concat([newPos.x, newPos.y]);

            this.minPos.x = pos.x < this.minPos.x ? pos.x : this.minPos.x;
            this.minPos.y = pos.y < this.minPos.y ? pos.y : this.minPos.y;

            this.line.points(newPoints);
            this.layer.batchDraw();
        }
    }

    mouseUp(): CurrentSelectedKonvaObject {
        super.mouseUp();
        const pos = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
        const newPos = new Coords(pos.x - this.position.x, pos.y - this.position.y);
        const points = this.line.points().concat([newPos.x, newPos.y]);
        this.minPos.x = pos.x < this.minPos.x ? pos.x : this.minPos.x;
        this.minPos.y = pos.y < this.minPos.y ? pos.y : this.minPos.y;

        this.points = points;
        this.transformBrushObjectPos();

        this.line.points(this.points);

        this.layer.add(this.line);
        this.layer.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = this;
        toEmit.konvaObject = this.line;
        toEmit.type = this.type;
        toEmit.layer = this.layer;
        return toEmit;
    }

    private transformBrushObjectPos(): void {
        if (this.minPos.x < this.position.x) {
            this.points = this.points.map((point, i) => {
                if (i === 0 || i % 2 === 0) {
                    return point + (this.position.x - this.minPos.x);
                }
                return point;
            });
            this.position.x = this.minPos.x;
            this.line.x(this.position.x);
        }
        if (this.minPos.y < this.position.y) {
            this.points = this.points.map((point, i) => {
                if ( i % 2 !== 0) {
                    return point + (this.position.y - this.minPos.y);
                }
                return point;
            });
            this.position.y = this.minPos.y;
            this.line.y(this.position.y);
        }
    }
}
