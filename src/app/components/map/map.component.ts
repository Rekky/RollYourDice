import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
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
    @Input() scale: number = 1;
    @Input() maxScale: number = 3;
    @Input() minScale: number = 0.3;
    @Input() scaleStep: number = 0.1;
    @Output() scaleChange: EventEmitter<number> = new EventEmitter<number>();

    constructor(private mouseInteractor: MouseInteractor,
                private cdr: ChangeDetectorRef) {
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
        window.addEventListener('resize', () => {
            this.gridStage.width(window.innerWidth);
            this.gridStage.height(window.innerHeight);
            this.initializeMap();
            this.gridStage.batchDraw();
        });
    }

    ngAfterViewInit(): void {
        // INICIALIZAMOS MAP CON KONVA
        this.initializeMap();
        this.mouseInteractor.setMouseEvents(this.mapEl, this.map, this.gridStage, this.layers);
        this.mouseInteractor.paintObjectsOnMap(this.map.objects, this.layers);
        this.setMapElEvents();
        this.gridStage.batchDraw();
        this.cdr.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.scale) {
            // scale with the new valor on input this.scale
            setTimeout(() => {
                this.gridStage.scale({ x: this.scale, y: this.scale });
            }, 100);
        }

        if (this.modification) {
            if (this.modification.type === 'create') {
                this.mouseInteractor.paintObjectOnMap(this.modification.object, this.layers);
            }
            if (this.modification.type === 'update') {
                this.mouseInteractor.deleteObjectOnMap(this.modification);
                this.mouseInteractor.paintObjectOnMap(this.modification.object, this.layers);
                if (this.currentMapObjectSelected.ourKonvaObject.id === this.modification.object.id) {
                    this.mouseInteractor.unsetSelectedKonvaObject();
                }
            }
            if (this.modification.type === 'delete') {
                this.mouseInteractor.deleteObjectOnMap(this.modification);
                if (this.currentMapObjectSelected.ourKonvaObject.id === this.modification.object.id) {
                    this.mouseInteractor.unsetSelectedKonvaObject();
                }
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
        const stage = new Konva.Stage({
            container: 'map' + this.map.id,
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: false,
            scale: {x: this.scale, y: this.scale}
        });

        stage.container().style.backgroundColor = '#f2f2f2';

        this.mapWidth = window.innerWidth;
        this.mapHeight = window.innerHeight;

        stage.on('click tap', (e) => {
            if (this.currentMapObjectSelected?.transformer &&
                e.target.attrs !== this.currentMapObjectSelected?.konvaObject?.getAttrs()) {
                this.mouseInteractor.unsetSelectedKonvaObject();
            }
        });

        stage.on('mousedown', (e) => {
            if (this.mouseInteractor.mouse.state !== 'pointer') {
                stage.setDraggable(false);
                return;
            }
            if (e.evt.button === 2) {
                this.currentMapObjectSelected?.transformer.hide();
                if (this.layers?.draws?.children?.length > 0) {
                    this.layers?.draws?.cache();
                }
                Konva.dragButtons = [2];
                stage.setDraggable(true);
            }
        });

        stage.on('mouseup', (e) => {
            if (e.evt.button === 2) {
                this.currentMapObjectSelected?.transformer.show();
                if (this.layers?.draws?.children?.length > 0) {
                    this.layers?.draws?.clearCache();
                }
                Konva.dragButtons = [0];
                stage.setDraggable(false);
            }
        });

        this.drawGrid();
        stage.add(this.layers.grid);
        stage.add(this.layers.objects);
        stage.add(this.layers.shadows);
        stage.add(this.layers.draws);
        stage.add(this.layers.texts);
        this.gridStage = stage;
        this.mouseInteractor.setStage(stage);
    }

    /**Zoom the stage at the given position
     Parameters:
     stage: the stage to be zoomed.
     zoomPoint: the (x, y) for centre of zoom.
     zoomBefore: the zoom factor at the start of the process.
     inc : the amount of zoom to apply.
     returns: zoom factor after zoom completed.
     */
    zoomStage2(stage, zoomPoint, zoomBefore, inc): any {
        // remember the scale before new zoom is applied - we are scaling
        // same in x & y so either will work
        const oldScale = stage.scaleX();

        // compute the distance to the zoom point before applying zoom
        const mousePointTo = {
            x: (zoomPoint.x - stage.x()) / oldScale,
            y: (zoomPoint.y - stage.y()) / oldScale
        };

        // compute new scale
        const zoomAfter = zoomBefore + inc;

        // apply new zoom to stage
        stage.scale({ x: zoomAfter, y: zoomAfter });

        // Important - move the stage so that the zoomed point remains
        // visually in place
        const newPos = {
            x: zoomPoint.x - mousePointTo.x * zoomAfter,
            y: zoomPoint.y - mousePointTo.y * zoomAfter
        };
        // Apply position to stage
        stage.position(newPos);
        // return the new zoom factor.
        this.selectedObjectEditorPosition = OurKonvaMouse.calculateObjectPositionOnGrid(this.currentMapObjectSelected, this.gridStage);
        // this.zoomChange.emit(zoomAfter);
        return zoomAfter;
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

    async drawGrid(): Promise<void> {
        const gridGroup = new Konva.Group({
            id: 'gridGroup',
        });

        gridGroup.add(new Konva.Rect({
            x: 0,
            y: 0,
            draggable: false,
            width: this.map.grid.cellSize * this.map.nColumns,
            height: this.map.grid.cellSize * this.map.nRows,
            id: 'grid-background',
            name: 'grid-background',
            fill: this.map.backgroundColor,
        }));

        try {
            if (this.map.backgroundImage) {
                await this.drawGridBackgroundImage(gridGroup);
            }
            this.drawGridLines(gridGroup);

            this.layers.grid.add(gridGroup);
            this.layers?.grid?.cache();
        }
        catch (e) {
            console.log(e);
        }
    }

    drawGridBackgroundImage(gridGroup: Konva.Group): Promise<void> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = this.map.backgroundImage.uri;
            image.onload = () => {
                gridGroup.add(new Konva.Rect({
                    x: 0,
                    y: 0,
                    draggable: false,
                    width: Math.round(this.map.grid.cellSize * this.map.nColumns),
                    height: Math.round(this.map.grid.cellSize * this.map.nRows),
                    id: this.map.backgroundImage.id,
                    name: this.map.backgroundImage.name,
                    fillPatternImage: image,
                    fillPatternOffset: { x: 0, y: 0 },
                    fillPatternRepeat: 'no-repeat',
                }));
                resolve();
            };

        });
    }

    drawGridLines(gridGroup: Konva.Group): void {
        for (let i = 0; i <= this.map.nColumns; i++) {
            gridGroup.add(new Konva.Line({
                points: [
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    0,
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    this.map.nRows * this.map.grid.cellSize
                ],
                stroke: this.map.grid.color,
                strokeWidth: 1,
            }));
        }

        gridGroup.add(new Konva.Line({
            points: [0, 0, 10, 10]
        }));
        for (let j = 0; j <= this.map.nRows; j++) {
            gridGroup.add(new Konva.Line({
                points: [
                    0,
                    Math.round(j * this.map.grid.cellSize),
                    this.map.nColumns * this.map.grid.cellSize,
                    Math.round(j * this.map.grid.cellSize)
                ],
                stroke: this.map.grid.color,
                strokeWidth: 1,
            }));
        }
    }

    setMapElEvents(): void {
        this.mapEl.nativeElement.addEventListener('mousedown', (ev: MouseEvent) => {
            this.displaySelectedObjectEditor = false;
        });
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

            if (this.scale <= this.minScale) {
                this.scale = this.minScale + this.scaleStep;
                return;
            } else if (this.scale >= this.maxScale) {
                this.scale = this.maxScale - this.scaleStep;
                return;
            }

            const zoomInc = ev.deltaY > 0 ? -this.scaleStep : this.scaleStep;
            this.scale = this.zoomStage2(this.gridStage, pointer, this.scale, zoomInc);
            this.scale = Math.round(this.scale * 100) / 100;

            this.scaleChange.emit(this.scale);
        });
    }
}
