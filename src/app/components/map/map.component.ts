import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import Konva from 'konva';
import {MapInteractor} from '../../interactors/MapInteractor';
import {Map} from '../../classes/Map';
import {Coords} from '../../classes/Coords';
import {Grid} from '../../classes/Grid';
import {MouseService} from '../../services/mouse.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('mapEl') mapEl: ElementRef;
    @Input() map: Map;
    @Output() mapChange: EventEmitter<Map> = new EventEmitter<Map>();
    @Output() currentObjectSelected: EventEmitter<any> = new EventEmitter();
    currentToolSelected: string = 'cursor';
    _currentObjectSelected: any = null;

    // MAP VARS
    private isDraggable: boolean = false;
    private startX: number;
    private startY: number;
    private offsetX: number = 0;
    private offsetY: number = 0;
    mapWidth: number = 500;
    mapHeight: number = 500;
    gridCellWidth: number = 80;

    // DRAW FREE
    isPaint: boolean = false;
    lastLine: any;

    // DRAW TEXT
    isWriteText: boolean = false;

    // KONVA LIB
    gridLayer: Konva.Layer = null;
    gridStage: Konva.Stage = null;
    selectedObjectAttrs: any;
    activeTr: any;

    constructor(private mapInteractor: MapInteractor,
                private mouseService: MouseService) { }

    ngOnInit(): void {
        this.mouseService.getMouseObservable().subscribe((res) => {
            this.currentToolSelected = res;
        });
    }

    ngAfterViewInit(): void {
        this.mapEl.nativeElement.addEventListener('mousedown', (e) => {
            this.stateOnMouseDown(e);
        }, false);
        this.mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.stateOnMouseMove(e);
        }, false);
        this.mapEl.nativeElement.addEventListener('mouseup', (e) => {
            this.stateOnMouseUp(e);
        }, false);
        this.mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.stateOnMouseOut(e);
        }, false);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.map) {
            this.gridCellWidth = this.map.grid.cellSize;
            setTimeout(() => {
                this.drawGrid();
                this.drawGridBackgroundImage();
                this.gridStage.add(this.gridLayer);
            });
        }
    }

    setCurrentObjectSelected(ev, object, type): void {
        ev.stopPropagation();

        if (this._currentObjectSelected !== null) {
            this._currentObjectSelected.ev.srcElement.style.border = '';
        }

        if (object !== null) {
            this._currentObjectSelected = {ev, object, type};
            this._currentObjectSelected.ev.srcElement.style.border = '2px solid rgb(91, 146, 226)';
        }

        this.currentObjectSelected.emit(this._currentObjectSelected);
    }

    drawGrid(): void {
        this.gridLayer = new Konva.Layer();
        this.gridStage = new Konva.Stage({
            container: 'map' + this.map.id,
            width: this.map.columns * this.map.grid.cellSize,
            height: this.map.rows * this.map.grid.cellSize
        });
        this.gridStage.on('click', (e) => {
            if (this.activeTr && e.target.attrs !== this.selectedObjectAttrs) {
                this.activeTr.hide();
                this.gridStage.batchDraw();
            }
        });
        this.mapWidth = this.map.columns * this.map.grid.cellSize;
        this.mapHeight = this.map.rows * this.map.grid.cellSize;

        for (let i = 0; i < this.map.columns; i++) {
            this.gridLayer.add(new Konva.Line({
                points: [Math.round(i * this.map.grid.cellSize) + 0.5, 0, Math.round(i * this.map.grid.cellSize) + 0.5, this.map.rows * this.map.grid.cellSize],
                stroke: '#ddd',
                strokeWidth: 1,
            }));
        }

        this.gridLayer.add(new Konva.Line({points: [0, 0, 10, 10]}));
        for (let j = 0; j < this.map.rows; j++) {
            this.gridLayer.add(new Konva.Line({
                points: [0, Math.round(j * this.map.grid.cellSize), this.map.columns * this.map.grid.cellSize, Math.round(j * this.map.grid.cellSize)],
                stroke: '#ddd',
                strokeWidth: 0.5,
            }));
        }

        this.addImageToKonva('https://konvajs.org/assets/darth-vader.jpg');

        const shadowRectangle = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.map.grid.cellSize * 2,
            height: this.map.grid.cellSize * 2,
            fill: '#FF7B17',
            opacity: 0.6,
            stroke: '#CF6412',
            strokeWidth: 3,
            dash: [20, 2]
        });
        const rectangle = new Konva.Rect({
            x: 50,
            y: 50,
            width: this.map.grid.cellSize * 2,
            height: this.map.grid.cellSize * 2,
            fill: '#fff',
            stroke: '#ddd',
            strokeWidth: 1,
            shadowColor: 'black',
            shadowBlur: 2,
            shadowOffset: {x : 1, y : 1},
            shadowOpacity: 0.4,
            draggable: true
        });
        shadowRectangle.hide();
        this.gridLayer.add(shadowRectangle);

        rectangle.on('dragstart', (e) => {
            shadowRectangle.show();
            shadowRectangle.moveToTop();
            rectangle.moveToTop();
        });
        rectangle.on('dragend', (e) => {
            const newPosition = Grid.correctPosition(new Coords(rectangle.x(), rectangle.y()), this.map.grid.cellSize);
            rectangle.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.gridStage.batchDraw();
            shadowRectangle.hide();
        });
        rectangle.on('dragmove', (e) => {
            const newPosition = Grid.correctPosition(new Coords(rectangle.x(), rectangle.y()), this.map.grid.cellSize);
            shadowRectangle.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.gridStage.batchDraw();
        });
        this.gridLayer.add(rectangle);
    }

    addImageToKonva(url: string): void {
        Konva.Image.fromURL(
            url,
            (img: Konva.Image) => {
                img.setAttrs({
                    width: 300,
                    height: 100,
                    x: 80,
                    y: 100,
                    name: 'image',
                    draggable: true,
                });
                img.on('dragstart', (e) => {
                    const imgAttrs = e.currentTarget.attrs;
                    imgAttrs.mapId = this.map.id;
                    // this.mouseService.setDragImage(imgAttrs);
                    // img.hide();
                    img.setAttrs({opacity: 0.5});
                });
                img.on('dragend', () => {
                    // this.mouseService.setDragImage(null);
                    // img.show();
                    img.setAttrs({opacity: 1});
                    this.gridStage.batchDraw();
                });
                const tr = new Konva.Transformer({
                    nodes: [img],
                    padding: 5,
                    // limit transformer size
                    boundBoxFunc: (oldBox, newBox) => {
                        if (newBox.width < 20) {
                            return oldBox;
                        }
                        return newBox;
                    },
                });
                tr.hide();
                this.gridLayer.add(tr);
                img.on('dblclick', (e) => {
                    this.selectedObjectAttrs = img.getAttrs();
                    this.activeTr = tr;
                    tr.show();
                    this.gridStage.batchDraw();
                });
                this.gridLayer.add(tr);
                this.gridLayer.add(img);
            }
        );
    }

    drawGridBackgroundImage(): void {
        const layer = new Konva.Layer();
        this.gridStage.add(layer);
        Konva.Image.fromURL('./../assets/backgrounds/CROSSING_THE_RIVER.jpg', (image) => {
            layer.add(image);
            image.setAttrs({
                x: 0,
                y: 0,
                width: this.map.columns * this.map.grid.cellSize,
                height: this.map.rows * this.map.grid.cellSize
            });
            image.cache();
            layer.draw();
        });
    }

    drawText(res: string): void {
        if (res === 'mousedown') {
            const pos = this.gridStage.getPointerPosition();
            const textNode = new Konva.Text({
                text: 'Some text here',
                x: pos.x,
                y: pos.y,
                fontSize: 20,
                draggable: true,
                width: 200,
            });
            this.gridLayer.add(textNode);

            const tr = new Konva.Transformer({
                node: textNode,
                enabledAnchors: ['middle-left', 'middle-right'],
                boundBoxFunc: (oldBox, newBox) => {
                    newBox.width = Math.max(30, newBox.width);
                    return newBox;
                },
            });

            this.gridLayer.add(tr);
            this.gridLayer.draw();
            this.mouseService.setMouse('select');

            textNode.on('transform', () => {
                // reset scale, so only with is changing by transformer
                textNode.setAttrs({
                    width: textNode.width() * textNode.scaleX(),
                    scaleX: 1,
                });
            });
            textNode.on('dblclick', () => {
                console.log('entrasssstee');
                textNode.hide();
                tr.hide();
                this.gridLayer.draw();

                const textPosition = textNode.absolutePosition();
                const stageBox = this.gridStage.container().getBoundingClientRect();
                const areaPosition = {
                    x: stageBox.left + textPosition.x,
                    y: stageBox.top + textPosition.y,
                };

                const textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                textarea.value = textNode.text();
                textarea.style.position = 'absolute';
                textarea.style.top = areaPosition.y + 'px';
                textarea.style.left = areaPosition.x + 'px';
                textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
                textarea.style.height =
                textNode.height() - textNode.padding() * 2 + 5 + 'px';
                textarea.style.fontSize = textNode.fontSize() + 'px';
                textarea.style.border = 'none';
                textarea.style.padding = '0px';
                textarea.style.margin = '0px';
                textarea.style.overflow = 'hidden';
                textarea.style.background = 'none';
                textarea.style.outline = 'none';
                textarea.style.resize = 'none';
                textarea.style.lineHeight = textNode.lineHeight();
                textarea.style.fontFamily = textNode.fontFamily();
                textarea.style.transformOrigin = 'left top';
                textarea.style.textAlign = textNode.align();
                textarea.style.color = textNode.fill();
                const rotation = textNode.rotation();
                const transform = '';
            });
        }

        if (res === 'mousemove') {

        }

        if (res === 'mouseup') {

        }

    }

    /** --------- EVENTS FOR DRAW FREE ---------- */
    drawFree(res: string, ev: MouseEvent): void {
        const mode = 'brush';

        if (res === 'mousedown') {
            this.isPaint = true;
            const pos = this.gridStage.getPointerPosition();
            this.lastLine = new Konva.Line({
                stroke: '#ffc107',
                strokeWidth: 5,
                globalCompositeOperation: mode === 'brush' ? 'source-over' : 'destination-out',
                points: [pos.x, pos.y],
            });
            this.gridLayer.add(this.lastLine);
        }

        if (res === 'mousemove') {
            if (this.isPaint) {
                const pos = this.gridStage.getPointerPosition();
                const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
                this.lastLine.points(newPoints);
                this.gridLayer.batchDraw();
            }
        }

        if (res === 'mouseup') {
            this.isPaint = false;
        }

    }


    /** --------- EVENTS FOR MOVE MAP ----------- */
    mapMove(res: string, ev: MouseEvent): void {
        if (res === 'mousedown') {
            this.isDraggable = true;
            this.startX = ev.clientX - this.offsetX;
            this.startY = ev.clientY - this.offsetY;
        }

        if (res === 'mousemove') {
            if (this.isDraggable) {
                this.map.position.x = ev.clientX - this.startX;
                this.map.position.y = ev.clientY - this.startY;
            }
            this.offsetX = this.map.position.x;
            this.offsetY = this.map.position.y;
        }

        if (res === 'mouseup') {
            this.isDraggable = false;
            this.mapInteractor.setMapPosition(this.map.id, this.map.position);
        }
    }

    setScale(ev): void {
        /*if (ev.deltaY < 0) {
            this.map.scale = this.map.scale + 0.1;
        } else {
            if (this.map.scale > 0.2 && this.map.scale > -0.1) {
                this.map.scale = this.map.scale - 0.1;
            }
        }*/
    }

    ////////////////////////////////////////////////
    stateOnMouseDown(e: MouseEvent): void {
        switch (this.currentToolSelected) {
            case 'cursor':
                break;
            case 'move':
                this.mapMove('mousedown', e);
                break;
            case 'draw':
                this.drawFree('mousedown', e);
                break;
            case 'text':
                this.drawText('mousedown');
                break;
            default:
                break;
        }
    }

    stateOnMouseMove(e: MouseEvent): void {
        switch (this.currentToolSelected) {
            case 'cursor':
                break;
            case 'move':
                this.mapMove('mousemove', e);
                break;
            case 'draw':
                this.drawFree('mousemove', e);
                break;
            case 'text':
                this.drawText('mousemove');
                break;
            default:
                break;
        }
    }

    stateOnMouseUp(e: MouseEvent): void {
        switch (this.currentToolSelected) {
            case 'cursor':
                break;
            case 'move':
                this.mapMove('mouseup', e);
                break;
            case 'draw':
                this.drawFree('mouseup', e);
                break;
            case 'text':
                this.drawText('mouseup');
                break;
            default:
                break;
        }
    }

    stateOnMouseOut(e: MouseEvent): void {
        switch (this.currentToolSelected) {
            case 'cursor':
                break;
            case 'move':
                break;
            case 'draw':
                break;
            default:
                break;
        }
    }
}
