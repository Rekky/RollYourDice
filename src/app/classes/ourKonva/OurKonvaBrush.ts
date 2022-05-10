import Konva from 'konva';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from './OurKonvaMouse';
import {Player} from '../User';
import {ulid} from 'ulid';
import {Coords} from '../Coords';
import {OurKonvaLayers} from './OurKonvaLayers';

export class OurKonvaBrush extends OurKonvaMouse {
    id: string;
    position: Coords;
    state: string = 'brush';
    line: Konva.Line;
    points: number[];
    color: string;
    brushSize: number;
    minPos: Coords;

    constructor(author: Player) {
        super(author);
        this.id = ulid();
        this.position = new Coords();
        this.line = new Konva.Line();
        this.color = '#E2F24B';
        this.brushSize = 5;
        this.points = [];
        this.minPos = new Coords();
    }

    static paint(object: OurKonvaBrush, layers: OurKonvaLayers): CurrentSelectedKonvaObject {
        const line = new Konva.Line({
            id: object.id,
            stroke: object.color,
            strokeWidth: object.brushSize,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
            points: object.points,
            x: object.position.x,
            y: object.position.y,
        });

        const transformer = new Konva.Transformer({
            rotateAnchorOffset: 120,
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            padding: 10,
            anchorCornerRadius: 20
        });
        layers.draws.add(transformer);
        transformer.nodes([line]);
        transformer.id('tr-' + object.id);
        transformer.enabledAnchors();
        transformer.hide();

        layers.draws.add(line);
        layers.draws.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = object;
        toEmit.konvaObject = line;
        toEmit.type = object.state;
        toEmit.layer = layers.draws;
        toEmit.transformer = transformer;
        return toEmit;
    }

    mouseDown(): void {
        super.mouseDown();
        this.position = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
        this.line = new Konva.Line({
            stroke: this.color,
            strokeWidth: this.brushSize,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
            points: [0, 0],
            id: this.id,
            x: this.position.x,
            y: this.position.y
        });
        this.layers.draws.add(this.line);
        this.isAdaptedToGrid = false;
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
            this.layers.draws.batchDraw();
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

        const transformer = new Konva.Transformer({
            rotateAnchorOffset: 120,
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            padding: 10,
            anchorCornerRadius: 20
        });
        this.layers.draws.add(transformer);
        transformer.nodes([this.line]);
        transformer.id('tr-' + this.id);
        transformer.hide();

        this.layers.draws.add(this.line);
        this.layers.draws.batchDraw();

        const toEmit = new CurrentSelectedKonvaObject();
        toEmit.ourKonvaObject = this;
        toEmit.konvaObject = this.line;
        toEmit.type = this.state;
        toEmit.layer = this.layers.draws;
        toEmit.transformer = transformer;
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
