import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
    Output, SimpleChanges, ViewChild
} from '@angular/core';
import Konva from 'konva';
import {Coords} from '../../classes/Coords';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {Subscription} from 'rxjs';
import {OurKonvaMap, OurKonvaMapModification} from '../../classes/ourKonva/OurKonvaMap';
import {OurKonvaLayers} from '../../classes/ourKonva/OurKonvaLayers';
import {CurrentSelectedKonvaObject} from '../../classes/ourKonva/OurKonvaObject';
import KonvaEventObject = Konva.KonvaEventObject;
import {MetaMap} from '../../classes/Meta';
import { OurKonvaObject } from 'src/app/classes/ourKonva/OurKonvaObject';

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
    @Output() mapDragEvent: EventEmitter<any> = new EventEmitter<any>();
    public currentMapObjectSelected: CurrentSelectedKonvaObject;

    // SCALE MAP PARAMS
    @Input() scale: number = 1;
    @Input() maxScale: number = 3;
    @Input() minScale: number = 0.3;
    @Input() stepScale: number = 0.1;
    @Output() scaleChange: EventEmitter<number> = new EventEmitter<number>();

    // META PARAMS
    @Input() meta: MetaMap = null;

    public currentMapObjectsSelected: CurrentSelectedKonvaObject[] | null;
    public selectedObjectEditorPosition: Coords;
    public displaySelectedObjectEditor: boolean = false;

    // MAP VARS
    public mapWidth: number = 100;
    public mapHeight: number = 100;

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

    private hasCtrlKeydownFired: boolean = false;

    constructor(private mouseInteractor: MouseInteractor,
                private cdr: ChangeDetectorRef) {
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable()
            .subscribe((object: CurrentSelectedKonvaObject[] | null) => {
                this.currentMapObjectsSelected = object;
                if (object) {
                    this.selectedObjectEditorPosition = OurKonvaObject.calculateObjectPositionOnGrid(object[0], this.gridStage);
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
        // INICIALIZAMOS MAP CON KONVA DESPUES DEL RENDER
        this.initializeMap();
        this.mouseInteractor.setMouseEvents(this.mapEl, this.map, this.gridStage, this.layers);
        this.mouseInteractor.paintObjectsOnMap(this.map.objects, this.layers);
        this.setMapElEvents();
        this.cdr.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.scale) {
            // scale with the outSide @Input value of this.scale
            // setTimeout(() => {this.gridStage.scale({ x: this.scale, y: this.scale }); }, 0);
        }

        if (changes.map) {
            // setTimeout(() => {
                // console.log('GRID_STAGE', this.gridStage);
                // console.log('changes_map_stage', changes.map.currentValue.stage.attrs.y);
                // this.gridStage.y(changes.map.currentValue.stage.attrs.y);
                // this.gridStage.x(changes.map.currentValue.stage.attrs.x);
            // }, 300);
        }

        if (this.modification) {
            if (this.modification.type === 'create') {
                this.modification.objects.forEach(object => {
                    this.mouseInteractor.paintObjectOnMap(object, this.layers);
                });
            }
            if (this.modification.type === 'update') {
                this.modification.objects.forEach(object => {
                    this.mouseInteractor.deleteObjectOnMap(object);
                    this.mouseInteractor.paintObjectOnMap(object, this.layers);

                    const selectedObject = this.currentMapObjectsSelected.find(obj =>
                        obj.ourKonvaObject.id === object.id);
                    if (selectedObject) {
                        this.mouseInteractor.unsetSelectedKonvaObject();
                    }
                });
            }
            if (this.modification.type === 'delete') {
                this.modification.objects.forEach(object => {
                    this.mouseInteractor.deleteObjectOnMap(object);
                    const selectedObject = this.currentMapObjectsSelected.find(obj =>
                        obj.ourKonvaObject.id === object.id);
                    if (selectedObject) {
                        this.mouseInteractor.unsetSelectedKonvaObject();
                    }
                });
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
        // setTimeout(() => {
        //     stage.scale({ x: this.meta.attrs.scaleX, y: this.meta.attrs.scaleY });
        const stage = this.createStage();
        stage.container().style.backgroundColor = '#f3f4f6';

        this.mapWidth = window.innerWidth;
        this.mapHeight = window.innerHeight;

        this.setStageListeners(stage);

        this.drawGrid();
        this.createKonvaNodeTransformer();

        stage.add(this.layers.grid);
        stage.add(this.layers.objects);
        stage.add(this.layers.shadows);
        stage.add(this.layers.draws);
        stage.add(this.layers.texts);
        this.gridStage = stage;
        this.mouseInteractor.setStage(stage);
        // }, 50);

    }

    createStage(): Konva.Stage {
        // console.log('@INPUT_META->', this.meta);
        let stage;
        if (this.meta) {
            // console.log('tiene meta');
            stage = this.setMetaParams();
        } else {
            // console.log('no tiene meta');
            stage = new Konva.Stage({
                container: 'map' + this.map.id,
                width: window.innerWidth,
                height: window.innerHeight,
                draggable: false,
                scale: {x: this.scale, y: this.scale},
                x: 0,
                y: 0
            });
        }
        return stage;
    }

    setMetaParams(): Konva.Stage {
        return new Konva.Stage({
            container: 'map' + this.map.id,
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: false,
            scale: {x: this.meta.attrs?.scaleX ?? this.scale , y: this.meta.attrs?.scaleY ?? this.scale},
            x: this.meta.attrs?.x ?? 0,
            y: this.meta.attrs?.y ?? 0
        });
    }

    setStageListeners(stage: Konva.Stage): void {
        const container = stage.container();
        container.tabIndex = 1;
        container.focus();
        container.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.ctrlKey && !this.hasCtrlKeydownFired) {
                this.mouseInteractor.setCtrlKey(true);
                this.hasCtrlKeydownFired = true;
            }
        });
        container.addEventListener('keyup', (e: KeyboardEvent) => {
            if (this.hasCtrlKeydownFired) {
                this.mouseInteractor.setCtrlKey(false);
                this.hasCtrlKeydownFired = false;
            }
        });

        stage.on('click tap', (e) => {
            // this.currentMapObjectSelected?.forEach((object: CurrentSelectedKonvaObject) => {
            //     if (object?.transformer &&
            //         e.target.attrs !== object?.konvaObject?.getAttrs()) {
            //         this.mouseInteractor.unsetSelectedKonvaObject();
            //     }
            // });
        });

        stage.on('mousedown', (e) => {
            if (this.mouseInteractor.mouse.state !== 'pointer') {
                stage.setDraggable(false);
                return;
            }
            if (e.evt.button === 2) {
                // this.layers?.draws?.cache();
                // const tr = this.layers.draws.getChildren()[0] as Konva.Transformer;
                // tr.hide();
                // this.layers?.draws.cache({
                //     drawBorder: true,
                // });
                // this.layers.draws.batchDraw();
                Konva.dragButtons = [2];
                stage.setDraggable(true);
            }
        });

        stage.on('mouseup', (e) => {
            if (e.evt.button === 2) {
                // const tr = this.layers.draws.getChildren()[0] as Konva.Transformer;
                // tr.show();
                // this.layers?.draws?.clearCache();
                // this.layers.draws.batchDraw();
                Konva.dragButtons = [0];
                stage.setDraggable(false);
            }
        });

        stage.on('dragend', (ev: KonvaEventObject<DragEvent>) => {
            if (ev.target.attrs.container?.id?.includes('map')) {
                this.mapDragEvent.emit(ev.target.attrs);
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

    createKonvaNodeTransformer(): void {
        const transformer = new Konva.Transformer({
            rotateAnchorOffset: 120,
            padding: 10,
            anchorCornerRadius: 20,
        });
        transformer.id('tr-selectedObjects');
        transformer.show();
        this.layers.draws.add(transformer);
    }

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
        if (this.currentMapObjectsSelected) {
            this.selectedObjectEditorPosition = OurKonvaObject.calculateObjectPositionOnGrid(
                this.currentMapObjectsSelected[0], this.gridStage);
        }
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

        // try {
            // if (this.map.backgroundImage) {
            //     await this.drawGridBackgroundImage(gridGroup);
            // }
        this.drawGridLines(gridGroup);

        this.layers.grid.add(gridGroup);
        this.layers?.grid?.cache();
        // }
        // catch (e) {
        //     console.log(e);
        // }
    }

    // drawGridBackgroundImage(gridGroup: Konva.Group): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         const image = new Image();
    //         image.src = this.map.backgroundImage.uri;
    //         image.onload = () => {
    //             gridGroup.add(new Konva.Rect({
    //                 x: 0,
    //                 y: 0,
    //                 draggable: false,
    //                 width: Math.round(this.map.grid.cellSize * this.map.nColumns),
    //                 height: Math.round(this.map.grid.cellSize * this.map.nRows),
    //                 id: this.map.backgroundImage.id,
    //                 name: this.map.backgroundImage.name,
    //                 fillPatternImage: image,
    //                 fillPatternOffset: { x: 0, y: 0 },
    //                 fillPatternRepeat: 'no-repeat',
    //             }));
    //             resolve();
    //         };
    //
    //     });
    // }

    drawGridLines(gridGroup: Konva.Group): void {
        for (let i = 0; i <= this.map.nColumns; i++) {
            gridGroup.add(new Konva.Line({
                points: [
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    0,
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    this.map.nRows * this.map.grid.cellSize
                ],
                stroke: this.map.grid.stroke,
                strokeWidth: this.map.grid.strokeSize,
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
                stroke: this.map.grid.stroke,
                strokeWidth: this.map.grid.strokeSize,
            }));
        }
    }

    setMapElEvents(): void {
        this.mapEl.nativeElement.addEventListener('mousedown', (ev: MouseEvent) => {
            this.displaySelectedObjectEditor = false;
        });
        this.mapEl.nativeElement.addEventListener('mouseup', (ev: MouseEvent) => {
            if (this.currentMapObjectsSelected) {
                this.selectedObjectEditorPosition = OurKonvaObject.calculateObjectPositionOnGrid(
                    this.currentMapObjectsSelected[0], this.gridStage);
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
                this.scale = this.minScale + this.stepScale;
                return;
            } else if (this.scale >= this.maxScale) {
                this.scale = this.maxScale - this.stepScale;
                return;
            }

            // scale map
            const zoomInc = ev.deltaY > 0 ? -this.stepScale : this.stepScale;
            this.scale = this.zoomStage2(this.gridStage, pointer, this.scale, zoomInc);
            this.scale = Math.round(this.scale * 100) / 100;
            this.scaleChange.emit(this.scale);
        });
    }
}
