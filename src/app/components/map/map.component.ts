import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
    Output, SimpleChanges, ViewChild
} from '@angular/core';
import Konva from 'konva';
import {MapInteractor} from '../../interactors/MapInteractor';
import {Coords} from '../../classes/Coords';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {Subscription} from 'rxjs';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import {OurKonvaGrid} from '../../classes/ourKonva/OurKonvaGrid';
import {SocketService} from '../../services/socket.service';
import {OurKonvaLayers} from '../../classes/ourKonva/OurKonvaLayers';
import {MouseService} from '../../services/mouse.service';
import {document} from 'ngx-bootstrap/utils';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @ViewChild('mapEl') mapEl: ElementRef;
    @Input() map: OurKonvaMap;
    @Output() mapChange: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() mapMoveEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() currentObjectSelected: EventEmitter<any> = new EventEmitter();
    currentMapObjectSelected: any = null;

    // MAP VARS
    mapWidth: number = 400;
    mapHeight: number = 400;
    isMovingMap: boolean = false;
    startCoords: Coords = new Coords();
    offsetCoords: Coords = new Coords();

    // KONVA LIB
    // gridLayer: Konva.Layer = null;
    layers: OurKonvaLayers = new OurKonvaLayers();
    gridStage: Konva.Stage;
    selectedObjectAttrs: any;
    activeTr: any;

    getCurrentSelectedObjectSub: Subscription;
    getMouseSubscription: Subscription;

    // subscriptions for socketObject
    rectangleTest: Konva.Rect = null;
    socketObjectSubscription: Subscription;
    displayCursor: string;

    mouseIsABrush: boolean = false;

    constructor(private mapInteractor: MapInteractor,
                private mouseInteractor: MouseInteractor,
                private mouseService: MouseService,
                private socketService: SocketService) { }

    ngOnInit(): void {
        this.getCurrentSelectedObjectSub = this.mouseInteractor.getCurrentSelectedObjectObservable().subscribe(res => {
            if (res) {
                this.activeTr = res.transformer;
                this.selectedObjectAttrs = res.konvaObject.getAttrs();
            }
        });
        this.getMouseSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res != null) {
                this.displayCursor = res.state ? res.state : 'pointer';
            }
        });
        this.mapInteractor.paintObjectsOnMap(this.map.objects, this.layers, this.map.id);
        this.socketService.socket.on('game-editor-object', (data) => {
            const jsonData = JSON.parse(data);
            if (this.rectangleTest.attrs) {
                this.rectangleTest.position({x: jsonData.attrs.x, y: jsonData.attrs.y});
                this.gridStage.batchDraw();
            }
        });
    }

    ngAfterViewInit(): void {
        // INICIALIZAMOS MAP CON KONVA
        this.initializeMap();
        this.mouseInteractor.setMouseEvents(this.mapEl, this.map, this.gridStage, this.layers);
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
                this.drawGridBackgroundImage();
                this.drawGrid();
                this.gridStage.add(this.layers.objects);
                this.gridStage.add(this.layers.grid);
                this.gridStage.add(this.layers.shadows);
                this.gridStage.add(this.layers.draws);
                this.gridStage.add(this.layers.texts);
                this.mouseInteractor.setStage(this.gridStage);
            }, 500);
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
        this.gridStage = new Konva.Stage({
            container: 'map' + this.map.id,
            width: this.map.columns * this.map.grid.cellSize,
            height: this.map.rows * this.map.grid.cellSize
        });
        // this.gridStage.on('click', (e) => {
        //     if (this.activeTr && e.target.attrs !== this.selectedObjectAttrs) {
        //         this.activeTr.hide();
        //         this.gridStage.draw();
        //     }
        // });
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
        this.mapWidth = this.map.columns * this.map.grid.cellSize;
        this.mapHeight = this.map.rows * this.map.grid.cellSize;

        for (let i = 0; i < this.map.columns; i++) {
            this.layers.grid.add(new Konva.Line({
                points: [Math.round(i * this.map.grid.cellSize) + 0.5, 0,
                    Math.round(i * this.map.grid.cellSize) + 0.5, this.map.rows * this.map.grid.cellSize],
                stroke: '#ddd',
                strokeWidth: 1,
            }));
        }

        this.layers.grid.add(new Konva.Line({points: [0, 0, 10, 10]}));
        for (let j = 0; j < this.map.rows; j++) {
            this.layers.grid.add(new Konva.Line({
                points: [0, Math.round(j * this.map.grid.cellSize),
                    this.map.columns * this.map.grid.cellSize, Math.round(j * this.map.grid.cellSize)],
                stroke: '#ddd',
                strokeWidth: 0.5,
            }));
        }

        // this.addImageToKonva('https://konvajs.org/assets/darth-vader.jpg');
        // const position = new Coords(10, 10, 0);
        // this.addRectangleToKonva(position);
    }

    moveMap(res: string, ev: MouseEvent): void {
        if (this.displayCursor === 'hand') {

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
                this.mapMoveEvent.emit(this.map);
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
            this.layers.texts.add(tr);
            this.layers.texts.add(img);
            this.gridStage.batchDraw();
        });
    }

    addRectangleToKonva(position: Coords): void {
        const shadowRectangle = new Konva.Rect({
            x: position.x,
            y: position.y,
            width: this.map.grid.cellSize * 2,
            height: this.map.grid.cellSize * 2,
            fill: '#FF7B17',
            opacity: 0.6,
            stroke: '#CF6412',
            strokeWidth: 3,
            dash: [20, 2]
        });
        this.rectangleTest = new Konva.Rect({
            x: position.x,
            y: position.y,
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
        // this.gridLayer.add(shadowRectangle);
        this.layers.draws.add(shadowRectangle);

        this.rectangleTest.on('dragstart', () => {
            shadowRectangle.show();
            shadowRectangle.moveToTop();
            this.rectangleTest.moveToTop();
        });
        this.rectangleTest.on('dragend', () => {
            const newPosition = OurKonvaGrid.correctPosition(new Coords(this.rectangleTest.x(), this.rectangleTest.y()), this.map.grid.cellSize);
            this.rectangleTest.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.gridStage.batchDraw();
            shadowRectangle.hide();
            this.mapInteractor.sendSocketObjectPosition(this.rectangleTest);
        });
        this.rectangleTest.on('dragmove', () => {
            const newPosition = OurKonvaGrid.correctPosition(new Coords(this.rectangleTest.x(), this.rectangleTest.y()), this.map.grid.cellSize);
            shadowRectangle.position({
                x: newPosition.x,
                y: newPosition.y
            });
            this.gridStage.batchDraw();
        });
        this.layers.draws.add(this.rectangleTest);
    }

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
