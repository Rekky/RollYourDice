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
import {Position} from '../../classes/Position';
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
    @Input() currentToolSelected: string = 'move';
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

    // DRAW FREE VARS
    isPaint: boolean = false;
    lastLine: any;

    // KONVA LIB
    gridLayer: any = null;
    gridStage: any = null;

    constructor(private mapInteractor: MapInteractor, private mouseService: MouseService) { }

    ngOnInit(): void {
        this.mouseService.getMouseObservable().subscribe((res) => {
            this.currentToolSelected = res;
            console.log(this.currentToolSelected);
        });
    }

    ngAfterViewInit(): void {
        this.mapEl.nativeElement.addEventListener('mousedown', (e) => {
            if (this.currentToolSelected === 'move') {
                this.mapMove('mousedown', e);
            }
            if (this.currentToolSelected === 'draw') {
                this.drawFree('mousedown', e);
            }
        }, false);
        this.mapEl.nativeElement.addEventListener('mousemove', (e) => {
            if (this.currentToolSelected === 'move') {
                this.mapMove('mousemove', e);
            }
            if (this.currentToolSelected === 'draw') {
                this.drawFree('mousemove', e);
            }
        }, false);
        this.mapEl.nativeElement.addEventListener('mouseup', (e) => {
            if (this.currentToolSelected === 'move') {
                this.mapMove('mouseup', e);
            }
            if (this.currentToolSelected === 'draw') {
                this.drawFree('mouseup', e);
            }
        }, false);
        this.mapEl.nativeElement.addEventListener('mouseout', (e) => {

        }, false);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngChanges map');
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


        const shadowRectangle = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.map.grid.cellSize * 6,
            height: this.map.grid.cellSize * 3,
            fill: '#FF7B17',
            opacity: 0.6,
            stroke: '#CF6412',
            strokeWidth: 3,
            dash: [20, 2]
        });
        const rectangle = new Konva.Rect({
            x: 50,
            y: 50,
            width: this.map.grid.cellSize * 6,
            height: this.map.grid.cellSize * 3,
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
            const newPosition = Grid.correctPosition(new Position(rectangle.x(), rectangle.y()), this.map.grid.cellSize);
            rectangle.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.gridStage.batchDraw();
            shadowRectangle.hide();
        });
        rectangle.on('dragmove', (e) => {
            const newPosition = Grid.correctPosition(new Position(rectangle.x(), rectangle.y()), this.map.grid.cellSize);
            shadowRectangle.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.gridStage.batchDraw();
        });
        this.gridLayer.add(rectangle);

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

    /** --------- EVENTS FOR DRAW FREE ---------- */
    drawFree(res: string, ev: MouseEvent): void {
        const mode = 'brush';

        if (res === 'mousedown') {
            console.log('entrasssss', res);
            this.isPaint = true;
            const pos = this.gridStage.getPointerPosition();
            this.lastLine = new Konva.Line({
                stroke: '#df4b26',
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

}
