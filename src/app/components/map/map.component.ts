import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
    Output, SimpleChanges, ViewChild
} from '@angular/core';
import Konva from 'konva';
import {MapInteractor} from '../../interactors/MapInteractor';
import {Coords} from '../../classes/Coords';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {interval, Subscription} from 'rxjs';
import {OurKonvaMap, OurKonvaMapModification} from '../../classes/ourKonva/OurKonvaMap';
import {OurKonvaGrid} from '../../classes/ourKonva/OurKonvaGrid';
import {SocketService} from '../../services/socket.service';
import {OurKonvaLayers} from '../../classes/ourKonva/OurKonvaLayers';
import {MouseService} from '../../services/mouse.service';
import {document} from 'ngx-bootstrap/utils';
import {OurKonvaRect} from '../../classes/ourKonva/OurKonvaRect';
import {OurKonvaText} from '../../classes/ourKonva/OurKonvaText';
import {OurKonvaImage} from '../../classes/ourKonva/OurKonvaImage';
import {OurKonvaObject} from '../../classes/ourKonva/OurKonvaObject';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from '../../classes/ourKonva/OurKonvaMouse';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @ViewChild('mapEl') mapEl: ElementRef;
    @Input() map: OurKonvaMap;
    @Input() modification: OurKonvaMapModification;
    @Output() mapChange: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() mapMoveEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() currentObjectSelected: EventEmitter<any> = new EventEmitter();
    public currentMapObjectSelected: CurrentSelectedKonvaObject;
    public selectedObjectEditorPosition: Coords;
    public displaySelectedObjectEditor: boolean = false;
    Konvadraggable = true;

    // MAP VARS
    public mapWidth: number = 100;
    public mapHeight: number = 100;
    protected mapScale: number = 1;
    protected isMovingMap: boolean = false;
    protected startCoords: Coords = new Coords();
    protected offsetCoords: Coords = new Coords();

    // KONVA LIB
    // gridLayer: Konva.Layer = null;
    protected layers: OurKonvaLayers = new OurKonvaLayers();
    protected gridStage: Konva.Stage;
    protected selectedObjectAttrs: any;
    protected activeTr: any;

    protected getCurrentSelectedObjectSub: Subscription;
    protected getMouseSubscription: Subscription;
    protected getSelectedKonvaObjectSubscription;

    // subscriptions for socketObject
    protected rectangleTest: Konva.Rect = null;
    protected socketObjectSubscription: Subscription;
    public displayCursor: string;
    protected mouseIsABrush: boolean = false;

    // SCALE MAP PARAMS
    protected maxScaleSize: number = 5;
    protected minScaleSize: number = 0.5;
    protected scaleStep: number = 0.1;

    constructor(private mouseInteractor: MouseInteractor) {
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable()
            .subscribe((object: CurrentSelectedKonvaObject) => {
                this.currentMapObjectSelected = object;
                if (object) {
                    this.selectedObjectEditorPosition = OurKonvaMouse.calculateObjectPositionOnGrid(object, this.gridStage);
                    this.displaySelectedObjectEditor = true;
                } else {
                    this.displaySelectedObjectEditor = false;
                }
            });
    }

    ngOnInit(): void {
        // this.getCurrentSelectedObjectSub = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe(res => {
        //     if (res) {
        //         this.activeTr = res.transformer;
        //         this.selectedObjectAttrs = res.konvaObject.getAttrs();
        //     }
        // });
        // this.getMouseSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
        //     if (res != null) {
        //         this.displayCursor = res.state ? res.state : 'pointer';
        //     }
        // });
        // this.mapInteractor.paintObjectsOnMap(this.map.objects, this.layers, this.map.id);
        // this.socketService.socket.on('game-editor-object', (data) => {
        //     const jsonData = JSON.parse(data);
        //     if (this.rectangleTest.attrs) {
        //         this.rectangleTest.position({x: jsonData.attrs.x, y: jsonData.attrs.y});
        //         this.gridStage.batchDraw();
        //     }
        // });

        window.addEventListener('resize', () => {
            this.gridStage.width(window.innerWidth);
            this.gridStage.height(window.innerHeight);
            this.initializeMap();
            this.gridStage.batchDraw();
        });
    }

    /**Zoom the stage at the given position
     Parameters:
     stage: the stage to be zoomed.
     zoomPoint: the (x, y) for centre of zoom.
     zoomBefore: the zoom factor at the start of the process.
     inc : the amount of zoom to apply.
     returns: zoom factor after zoom completed.
     */
    zoomStage2(stage, zoomPoint, zoomBefore, inc) {
        // remember the scale before new zoom is applied - we are scaling
        // same in x & y so either will work
        let oldScale = stage.scaleX();

        // compute the distance to the zoom point before applying zoom
        var mousePointTo = {
            x: (zoomPoint.x - stage.x()) / oldScale,
            y: (zoomPoint.y - stage.y()) / oldScale
        };

        // compute new scale
        let zoomAfter = zoomBefore + inc;

        // apply new zoom to stage
        stage.scale({ x: zoomAfter, y: zoomAfter });

        // Important - move the stage so that the zoomed point remains
        // visually in place
        var newPos = {
            x: zoomPoint.x - mousePointTo.x * zoomAfter,
            y: zoomPoint.y - mousePointTo.y * zoomAfter
        };
        // Apply position to stage
        stage.position(newPos);
        // return the new zoom factor.
        return zoomAfter;
    }

    ngAfterViewInit(): void {
        // INICIALIZAMOS MAP CON KONVA
        this.initializeMap();
        this.mouseInteractor.setMouseEvents(this.mapEl, this.map, this.gridStage, this.layers);
        this.mouseInteractor.paintObjectsOnMap(this.map.objects, this.layers);

        this.mapEl.nativeElement.addEventListener('mousedown', (ev: MouseEvent) => {
            this.displaySelectedObjectEditor = false;
        });
        // this.mapEl.nativeElement.addEventListener('mousemove', (ev: MouseEvent) => {
        //     // this.moveMap('mousemove', ev);
        // });
        this.mapEl.nativeElement.addEventListener('mouseup', (ev: MouseEvent) => {
            if (this.currentMapObjectSelected) {
                this.selectedObjectEditorPosition = OurKonvaMouse.calculateObjectPositionOnGrid(
                    this.currentMapObjectSelected, this.gridStage);
                this.displaySelectedObjectEditor = true;
            }
        });
        this.mapEl.nativeElement.addEventListener('mouseout', (ev: MouseEvent) => {
            // this.moveMap('mouseout', ev);
        });
        this.mapEl.nativeElement.addEventListener('contextmenu', (ev: MouseEvent) => {
            ev.preventDefault();
        });
        this.mapEl.nativeElement.addEventListener('wheel', (ev: MouseEvent | any) => {

            const pointer = this.gridStage.getPointerPosition();

            if (this.mapScale < this.minScaleSize) {
                this.mapScale = this.minScaleSize;
                return;
            } else if (this.mapScale > this.maxScaleSize) {
                this.mapScale = this.maxScaleSize;
                return;
            }

            const zoomInc = ev.deltaY > 0 ? -this.scaleStep : this.scaleStep;
            this.mapScale = this.zoomStage2(this.gridStage, pointer, this.mapScale, zoomInc);
            this.gridStage.batchDraw();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.modification) {
            if (this.modification.type === 'create') {
                this.mouseInteractor.paintObjectOnMap(this.modification.object, this.layers);
            }
            if (this.modification.type === 'update') {
                this.mouseInteractor.deleteObjectOnMap(this.modification);
                this.mouseInteractor.paintObjectOnMap(this.modification.object, this.layers);
            }
            if (this.modification.type === 'delete') {
                this.mouseInteractor.deleteObjectOnMap(this.modification);
            }
        }
    }

    ngOnDestroy(): void {
        if (this.getCurrentSelectedObjectSub) {
            this.getCurrentSelectedObjectSub.unsubscribe();
        }
        if (this.socketObjectSubscription) {
            this.socketObjectSubscription.unsubscribe();
        }
        if (this.getMouseSubscription) {
            this.getMouseSubscription.unsubscribe();
        }
    }

    initializeMap(): void {
        // const box = document.getElementById('mapbox' + this.map.id);
        // Konva.dragButtons = [2];

        this.gridStage = new Konva.Stage({
            container: 'map' + this.map.id,
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: true,
            scale: {x: this.mapScale, y: this.mapScale}
        });

        this.gridStage.container().style.backgroundColor = '#f2f2f2';

        // this.map.nColumns = parseInt((box.width / this.map.grid.cellSize + 1).toFixed());
        // this.map.nRows = parseInt((box.height / this.map.grid.cellSize + 1).toFixed());
        // this.mapWidth = this.map.nColumns * this.map.grid.cellSize;
        // this.mapHeight = this.map.nRows * this.map.grid.cellSize;

        this.mapWidth = window.innerWidth;
        this.mapHeight = window.innerHeight;

        this.gridStage.on('click tap', (e) => {
            if (this.currentMapObjectSelected?.transformer &&
                e.target.attrs !== this.currentMapObjectSelected?.konvaObject?.getAttrs()) {
                this.mouseInteractor.unsetSelectedKonvaObject();
            }
        });

        this.gridStage.on('mousedown', (e) => {
            if (this.mouseInteractor.mouse.state !== 'pointer') {
                this.gridStage.setDraggable(false);
            } else {
                if (e.evt.button === 2) {
                    Konva.dragButtons = [2];
                    this.gridStage.setDraggable(true);
                }
                else {
                    Konva.dragButtons = [0];
                    this.gridStage.setDraggable(false);
                }
            }
        });

        this.drawGrid();
        this.gridStage.add(this.layers.grid);
        this.gridStage.add(this.layers.objects);
        this.gridStage.add(this.layers.shadows);
        this.gridStage.add(this.layers.draws);
        this.gridStage.add(this.layers.texts);
        this.mouseInteractor.setStage(this.gridStage);
    }

    setCurrentObjectSelected(ev, object, type): void {
        // ev.stopPropagation();
        //
        // if (this.currentMapObjectSelected !== null) {
        //     this.currentMapObjectSelected.ev.target.style.border = '';
        // }
        //
        // if (object !== null) {
        //     this.currentMapObjectSelected = {ev, object, type};
        //     this.currentMapObjectSelected.ev.target.style.border = '1px solid rgb(91, 146, 226)';
        // }
        //
        // this.currentObjectSelected.emit(this.currentMapObjectSelected);
    }

    drawGrid(): void {
        // var bgGrid = new Konva.Rect({
        //     x: 0,
        //     y: 0,
        //     width: this.map.nColumns * this.map.grid.cellSize,
        //     height: this.map.nRows * this.map.grid.cellSize,
        //     fill: '#f2f2f2'
        // });
        // this.layers.grid.add(bgGrid);

        for (let i = 0; i <= this.map.nColumns; i++) {
            this.layers.grid.add(new Konva.Line({
                points: [
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    0,
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    this.map.nRows * this.map.grid.cellSize
                ],
                stroke: '#e6e6e6',
                strokeWidth: 1,
            }));
        }

        this.layers.grid.add(new Konva.Line({
            points: [0, 0, 10, 10]
        }));
        for (let j = 0; j <= this.map.nRows; j++) {
            this.layers.grid.add(new Konva.Line({
                points: [
                    0,
                    Math.round(j * this.map.grid.cellSize),
                    this.map.nColumns * this.map.grid.cellSize,
                    Math.round(j * this.map.grid.cellSize)
                ],
                stroke: '#e6e6e6',
                strokeWidth: 1,
            }));
        }
    }

    moveMap(res: string, ev: MouseEvent): void {

        // if (this.displayCursor === 'hand') {
        // this.gridStage.setDraggable(true);
        if (res === 'mousedown') {
            // this.isMovingMap = true;
            // this.gridStage.setDraggable(true);
            // this.startCoords.x = ev.clientX - this.offsetCoords.x;
            // this.startCoords.y = ev.clientY - this.offsetCoords.y;
        }
        if (res === 'mousemove') {
            // if (this.isMovingMap) {
            // this.map.position.x = ev.clientX - this.startCoords.x;
            // this.map.position.y = ev.clientY - this.startCoords.y;
            // }
            // this.offsetCoords.x = this.map.position.x;
            // this.offsetCoords.y = this.map.position.y;
        }
        if (res === 'mouseup') {
            // this.isMovingMap = false;
            // this.mapMoveEvent.emit(this.map);
        }
        if (res === 'mouseout') {
            // this.isMovingMap = false;
        }
        // } else {
        //     this.gridStage.setDraggable(false);
        // }
    }

    // addImageToKonva(url: string): void {
    //     Konva.Image.fromURL(url, (img: Konva.Image) => {
    //         img.setAttrs({
    //             width: 300,
    //             height: 100,
    //             x: 200,
    //             y: 200,
    //             name: 'id',
    //             draggable: true,
    //         });
    //         img.on('dragstart', (e) => {
    //             const imgAttrs = e.currentTarget.attrs;
    //             imgAttrs.mapId = this.map.id;
    //             // this.mouseService.setDragImage(imgAttrs);
    //             // img.hide();
    //             img.setAttrs({opacity: 0.5});
    //         });
    //         img.on('dragend', () => {
    //             // this.mouseService.setDragImage(null);
    //             // img.show();
    //             img.setAttrs({opacity: 1});
    //             this.gridStage.batchDraw();
    //         });
    //         img.on('click', () => {
    //             this.selectedObjectAttrs = img.getAttrs();
    //             this.activeTr = tr;
    //             tr.show();
    //             this.gridStage.batchDraw();
    //         });
    //
    //         const tr = new Konva.Transformer({
    //             nodes: [img],
    //             padding: 5,
    //             // limit transformer size
    //             boundBoxFunc: (oldBox, newBox) => {
    //                 if (newBox.width < 20) {
    //                     return oldBox;
    //                 }
    //                 return newBox;
    //             },
    //         });
    //         tr.hide();
    //         this.layers.texts.add(tr);
    //         this.layers.texts.add(img);
    //         this.gridStage.batchDraw();
    //     });
    // }

    // addRectangleToKonva(position: Coords): void {
    //     const shadowRectangle = new Konva.Rect({
    //         x: position.x,
    //         y: position.y,
    //         width: this.map.grid.cellSize * 2,
    //         height: this.map.grid.cellSize * 2,
    //         fill: '#FF7B17',
    //         opacity: 0.6,
    //         stroke: '#CF6412',
    //         strokeWidth: 3,
    //         dash: [20, 2]
    //     });
    //     this.rectangleTest = new Konva.Rect({
    //         x: position.x,
    //         y: position.y,
    //         width: this.map.grid.cellSize * 2,
    //         height: this.map.grid.cellSize * 2,
    //         fill: '#fff',
    //         stroke: '#ddd',
    //         strokeWidth: 1,
    //         shadowColor: 'black',
    //         shadowBlur: 2,
    //         shadowOffset: {x : 1, y : 1},
    //         shadowOpacity: 0.4,
    //         draggable: true
    //     });
    //     shadowRectangle.hide();
    //     // this.gridLayer.add(shadowRectangle);
    //     this.layers.draws.add(shadowRectangle);
    //
    //     this.rectangleTest.on('dragstart', () => {
    //         shadowRectangle.show();
    //         shadowRectangle.moveToTop();
    //         this.rectangleTest.moveToTop();
    //     });
    //     this.rectangleTest.on('dragend', () => {
    //         const newPosition = OurKonvaGrid.correctPosition(
    //         new Coords(this.rectangleTest.x(), this.rectangleTest.y()), this.map.grid.cellSize);
    //         this.rectangleTest.position({
    //             x: newPosition.x,
    //             y: newPosition.y
    //         });
    //         this.gridStage.batchDraw();
    //         shadowRectangle.hide();
    //         this.mapInteractor.sendSocketObjectPosition(this.rectangleTest);
    //     });
    //     this.rectangleTest.on('dragmove', () => {
    //         const newPosition = OurKonvaGrid.correctPosition(
    //         new Coords(this.rectangleTest.x(), this.rectangleTest.y()), this.map.grid.cellSize);
    //         shadowRectangle.position({
    //             x: newPosition.x,
    //             y: newPosition.y
    //         });
    //         this.gridStage.batchDraw();
    //     });
    //     this.layers.draws.add(this.rectangleTest);
    // }

    drawGridBackgroundImage(): void {
        // Konva.Image.fromURL('./../assets/backgrounds/CROSSING_THE_RIVER.jpg', (image) => {
        //     this.layers.grid.add(image);
        //     image.setAttrs({
        //         x: 0,
        //         y: 0,
        //         width: this.map.columns * this.map.grid.cellSize,
        //         height: this.map.rows * this.map.grid.cellSize,
        //     });
        //     image.cache();
        //     this.layers.grid.draw();
        // });
        this.gridStage.container().style.backgroundImage = 'url(' + this.map.backgroundImage + ')';
        this.gridStage.container().style.backgroundRepeat = 'no-repeat';
        this.gridStage.container().style.backgroundSize = 'cover';
        this.gridStage.container().style.backgroundPosition = 'center';
        this.gridStage.batchDraw();
    }
}
