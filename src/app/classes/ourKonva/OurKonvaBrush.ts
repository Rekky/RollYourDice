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

    constructor(author: Player) {
        super(author);
        this.id = ulid();
        this.position = new Coords();
        this.line = new Konva.Line();
        this.color = '#E2F24B';
        this.brushSize = 5;
        this.points = [];
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
            points: [this.position.x, this.position.y],
            id: this.id,
            x: this.position.x,
            y: this.position.y
        });
        this.layers.draws.add(this.line);
        console.log(this.position.x, this.position.y);
    }

    mouseMove(): void {
        super.mouseMove();
        if (this.isActive) {
            const pos = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
            console.log(pos.x, pos.y);
            const newPoints = this.line.points().concat([this.position.x - pos.x, this.position.y - pos.y]);
            this.line.points(newPoints);
            this.layers.draws.batchDraw();
        }
    }

    mouseUp(): CurrentSelectedKonvaObject {
        super.mouseUp();
        const pos = new Coords(this.stage.getRelativePointerPosition().x, this.stage.getRelativePointerPosition().y);
        const newPoints = this.line.points().concat([this.position.x - pos.x, this.position.y - pos.y]);
        this.line.points(newPoints);
        this.points = newPoints;

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
}
