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

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('mapEl') canvasEl: ElementRef;
    @Input() map: Map;
    @Output() mapChange: EventEmitter<Map> = new EventEmitter<Map>();
    @Output() currentObjectSelected: EventEmitter<any> = new EventEmitter();
    @Input() currentToolSelected: string = null;

    _currentObjectSelected: any = null;
    private isDraggable: boolean = false;
    private startX: number;
    private startY: number;
    private offsetX: number = 0;
    private offsetY: number = 0;
    // map.position.x = window.innerWidth / 3;
    // map.position.y = 200;

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    mapWidth: number = 500;
    mapHeight: number = 500;

    flag = false;
    prevX = 0;
    currX = 0;
    prevY = 0;
    currY = 0;
    dotFlag = false;

    // KONVA LIB
    gridLayer: any = null;
    gridCellWidth: number = 80;

    // KONVA STAGES
    gridStage: any = null;

    constructor(private mapInteractor: MapInteractor) { }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        /*this.canvasEl.nativeElement.addEventListener('mousemove', (e) => {
          if (this.currentToolSelected === 'move') {
            this.mapMove('mousemove', e);
          }
          if (this.currentToolSelected === 'draw') {
            console.log('DRAW');
          }
        }, false);
        this.canvasEl.nativeElement.addEventListener('mousedown', (e) => {
          if (this.currentToolSelected === 'move') {
            this.mapMove('mousedown', e);
          }
          if (this.currentToolSelected === 'draw') {
            console.log('DRAW');
          }
        }, false);
        this.canvasEl.nativeElement.addEventListener('mouseup', (e) => {
          if (this.currentToolSelected === 'move') {
            this.mapMove('mouseup', e);
          }
          if (this.currentToolSelected === 'draw') {
            console.log('DRAW');
          }
        }, false);
        this.canvasEl.nativeElement.addEventListener('mouseout', (e) => {
          console.log('DRAW');
        }, false);*/
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngChanges map');
        if (this.map) {
            console.log('this.map.grid.cellSize', this.map.grid);
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
            container: 'map',
            width: this.mapWidth,
            height: this.mapHeight
        });

        for (let i = 0; i < this.mapWidth / this.gridCellWidth; i++) {
            this.gridLayer.add(new Konva.Line({
                points: [Math.round(i * this.gridCellWidth) + 0.5, 0, Math.round(i * this.gridCellWidth) + 0.5, this.mapHeight],
                stroke: '#ddd',
                strokeWidth: 1,
            }));
        }

        this.gridLayer.add(new Konva.Line({points: [0, 0, 10, 10]}));
        for (let j = 0; j < this.mapHeight / this.gridCellWidth; j++) {
            this.gridLayer.add(new Konva.Line({
                points: [0, Math.round(j * this.gridCellWidth), this.mapWidth, Math.round(j * this.gridCellWidth)],
                stroke: '#ddd',
                strokeWidth: 0.5,
            }));
        }
    }

    drawGridBackgroundImage(): void {
        const layer = new Konva.Layer();
        this.gridStage.add(layer);
        Konva.Image.fromURL('./../assets/backgrounds/CROSSING_THE_RIVER.jpg', (image) => {
            layer.add(image);
            image.setAttrs({
                x: 0,
                y: 0,
                width: this.mapWidth,
                height: this.mapHeight
            });
            image.cache();
            layer.draw();
        });
    }

    /** --------- EVENTS FOR DRAW FREE ---------- */


    /** --------- EVENTS FOR MOVE MAP ----------- */
    mapMove(res, ev: MouseEvent): void {
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
