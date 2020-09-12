import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
    Output, SimpleChanges, ViewChild
} from '@angular/core';
import Konva from 'konva';
import {MapInteractor} from '../../interactors/MapInteractor';
import {Map} from '../../classes/Map';
import {Coords} from '../../classes/Coords';
import {Grid} from '../../classes/Grid';
import {MouseService} from '../../services/mouse.service';
import {KnownDeclaration} from '@angular/compiler-cli/src/ngtsc/reflection';
import {Mouse} from '../../classes/Mouse';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @ViewChild('mapEl') mapEl: ElementRef;
    @Input() map: Map;
    @Output() mapChange: EventEmitter<Map> = new EventEmitter<Map>();
    @Output() currentObjectSelected: EventEmitter<any> = new EventEmitter();
    currentMapObjectSelected: any = null;

    // MAP VARS
    mapWidth: number = 500;
    mapHeight: number = 500;
    isMovingMap: boolean = false;
    startCoords: Coords = new Coords();
    offsetCoords: Coords = new Coords();

    // KONVA LIB
    gridLayer: Konva.Layer = null;
    gridStage: Konva.Stage = null;
    selectedObjectAttrs: any;
    activeTr: any;

    getCurrentSelectedObjectSub: Subscription;

    constructor(private mapInteractor: MapInteractor,
                private mouseInteractor: MouseInteractor) { }

    ngOnInit(): void {
        this.getCurrentSelectedObjectSub = this.mouseInteractor.getCurrentSelectedObjectObservable().subscribe(res => {
            if (res) {
                this.activeTr = res.transformer;
                this.selectedObjectAttrs = res.attr;
            }
        });
    }

    ngAfterViewInit(): void {
        // INICIALIZAMOS MAP CON KONVA
        this.initializeMap();
        this.mouseInteractor.setMouseKonvaParameters(this.gridStage, this.gridLayer, this.map);
        this.mouseInteractor.setMouseEvents(this.mapEl);
        this.mapEl.nativeElement.addEventListener('mousedown', (ev: MouseEvent) => {
            this.moveMap('mousedown', ev);
        });
        this.mapEl.nativeElement.addEventListener('mousemove', (ev: MouseEvent) => {
            this.moveMap('mousemove', ev);
        });
        this.mapEl.nativeElement.addEventListener('mouseup', (ev: MouseEvent) => {
            this.moveMap('mouseup', ev);
        });
        this.mapEl.nativeElement.addEventListener('mouseout', (ev: MouseEvent) => {
            this.moveMap('mouseout', ev);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.map) {
            setTimeout(() => {
                this.drawGrid();
                this.drawGridBackgroundImage();
                this.gridStage.add(this.gridLayer);
            });
        }
    }

    ngOnDestroy(): void {
        if (this.getCurrentSelectedObjectSub) {
            this.getCurrentSelectedObjectSub.unsubscribe();
        }
    }

    initializeMap(): void {
        this.gridLayer = new Konva.Layer();
        this.gridStage = new Konva.Stage({
            container: 'map' + this.map.id,
            width: this.map.columns * this.map.grid.cellSize,
            height: this.map.rows * this.map.grid.cellSize
        });
        this.gridStage.on('click', (e) => {
            if (this.activeTr && e.target.attrs !== this.selectedObjectAttrs) {
                this.activeTr.hide();
                this.gridStage.draw();
            }
        });
    }

    setCurrentObjectSelected(ev, object, type): void {
        ev.stopPropagation();

        if (this.currentMapObjectSelected !== null) {
            this.currentMapObjectSelected.ev.target.style.border = '';
        }

        if (object !== null) {
            this.currentMapObjectSelected = {ev, object, type};
            this.currentMapObjectSelected.ev.target.style.border = '1px solid rgb(91, 146, 226)';
        }

        this.currentObjectSelected.emit(this.currentMapObjectSelected);
    }

    drawGrid(): void {
        this.mapWidth = this.map.columns * this.map.grid.cellSize;
        this.mapHeight = this.map.rows * this.map.grid.cellSize;

        for (let i = 0; i < this.map.columns; i++) {
            this.gridLayer.add(new Konva.Line({
                points: [Math.round(i * this.map.grid.cellSize) + 0.5, 0,
                    Math.round(i * this.map.grid.cellSize) + 0.5, this.map.rows * this.map.grid.cellSize],
                stroke: '#ddd',
                strokeWidth: 1,
            }));
        }

        this.gridLayer.add(new Konva.Line({points: [0, 0, 10, 10]}));
        for (let j = 0; j < this.map.rows; j++) {
            this.gridLayer.add(new Konva.Line({
                points: [0, Math.round(j * this.map.grid.cellSize),
                    this.map.columns * this.map.grid.cellSize, Math.round(j * this.map.grid.cellSize)],
                stroke: '#ddd',
                strokeWidth: 0.5,
            }));
        }

        this.addImageToKonva('https://konvajs.org/assets/darth-vader.jpg');
        this.addRectangleToKonva();
    }

    moveMap(res: string, ev: MouseEvent): void {
        if (this.mouseInteractor.mouse.state === 'hand') {
            if (res === 'mousedown') {
                this.isMovingMap = true;
                this.startCoords.x = ev.clientX - this.offsetCoords.x;
                this.startCoords.y = ev.clientY - this.offsetCoords.y;
            }
            if (res === 'mousemove') {
                if (this.isMovingMap) {
                    this.map.position.x = ev.clientX - this.startCoords.x;
                    this.map.position.y = ev.clientY - this.startCoords.y;
                }
                this.offsetCoords.x = this.map.position.x;
                this.offsetCoords.y = this.map.position.y;
            }
            if (res === 'mouseup') {
                this.isMovingMap = false;
            }
            if (res === 'mouseout') {
                this.isMovingMap = false;
            }
        }
    }

    addImageToKonva(url: string): void {
        Konva.Image.fromURL(url, (img: Konva.Image) => {
            img.setAttrs({
                width: 300,
                height: 100,
                x: 200,
                y: 200,
                name: 'id',
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
            img.on('click', () => {
                this.selectedObjectAttrs = img.getAttrs();
                this.activeTr = tr;
                tr.show();
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
            this.gridLayer.add(img);
            this.gridStage.batchDraw();
        });
    }

    addRectangleToKonva(): void {
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

        rectangle.on('dragstart', () => {
            shadowRectangle.show();
            shadowRectangle.moveToTop();
            rectangle.moveToTop();
        });
        rectangle.on('dragend', () => {
            const newPosition = Grid.correctPosition(new Coords(rectangle.x(), rectangle.y()), this.map.grid.cellSize);
            rectangle.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.gridStage.batchDraw();
            shadowRectangle.hide();
        });
        rectangle.on('dragmove', () => {
            const newPosition = Grid.correctPosition(new Coords(rectangle.x(), rectangle.y()), this.map.grid.cellSize);
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
}
