import {ElementRef, Injectable, OnDestroy, OnInit} from '@angular/core';
import {MouseService} from '../services/mouse.service';
import Konva from 'konva';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from '../classes/ourKonva/OurKonvaMouse';
import {OurKonvaPointer} from '../classes/ourKonva/OurKonvaPointer';
import {OurKonvaMap, OurKonvaMapModification} from '../classes/ourKonva/OurKonvaMap';
import {OurKonvaLayers} from '../classes/ourKonva/OurKonvaLayers';
import {OurKonvaRect} from '../classes/ourKonva/OurKonvaRect';
import {OurKonvaImage} from '../classes/ourKonva/OurKonvaImage';
import {OurKonvaText} from '../classes/ourKonva/OurKonvaText';
import {SocketService} from '../services/socket.service';
import {MapObjectService} from '../services/map-object.service';
import {OurKonvaGrid} from '../classes/ourKonva/OurKonvaGrid';
import {Coords} from '../classes/Coords';
import {OurKonvaBrush} from '../classes/ourKonva/OurKonvaBrush';

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor implements OnDestroy {
    private selectedKonvaObjects: BehaviorSubject<CurrentSelectedKonvaObject[]> = new BehaviorSubject<CurrentSelectedKonvaObject[]>([]);

    mouse: OurKonvaMouse | OurKonvaRect | OurKonvaText | OurKonvaImage;

    getMouseObservableSubscription: Subscription;
    selectedKonvaObjectSubscription: Subscription;

    stage: Konva.Stage;
    currentMap: OurKonvaMap = null;
    isCtrlKeyPressed: boolean = false;

    constructor(private mouseService: MouseService,
                private mapObjectService: MapObjectService,
                private socketService: SocketService) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
                this.mouse = res;
            }
        });
        this.selectedKonvaObjectSubscription = this.getSelectedKonvaObjectObservable().subscribe((object: CurrentSelectedKonvaObject[]) => {
            if (object) {
                document.onkeyup = (ev) => {
                    if (ev.key === 'Delete' && document.activeElement.tagName !== 'INPUT') {
                        object.forEach((o) => {
                            this.socketService.deleteGameObject(this.currentMap.id, o.ourKonvaObject);
                        });
                        this.selectedKonvaObjects.next([]);
                    }
                };
            }
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.selectedKonvaObjectSubscription) {
            this.selectedKonvaObjectSubscription.unsubscribe();
        }
    }

    // Serveix per passar tota l'informació que es necessita per saber en quin mapa es troba treballant l'usuari i la referència a aquest
    setMouseEvents(mapEl: ElementRef, map: OurKonvaMap, stage: Konva.Stage, layers: OurKonvaLayers): void {
        // Estableix un listener per saber quan es fa MouseDown en el mapa sobre el que es treballa
        this.currentMap = map;
        mapEl.nativeElement.addEventListener('mousedown', (e) => {
            // Seteja les propietats del this.mouse amb les del mapa en el que s'està treballant
            this.mouse.stage = stage;
            this.mouse.layers = layers;
            this.mouse.isActive = true;
            this.mouse.ev = e;

            // Si el ratolí no és un punter es deselecciona l'objecte que estigui seleccionat en aquell moment
            if (this.mouse.state !== 'pointer') {
                this.selectedKonvaObjects.next([]);
            }


            this.mouse.mouseDown(); // Executa la funció mouseDown() que correspongui a l'estat en el que està el ratolí

            // const mouseDown = this.mouse.mouseDown(); // Agafa la funció mouseDown() que correspongui a l'estat en el que està el ratolí
            // if (mouseDown) {
            //     // this.mouseService.setMouse(new OurKonvaPointer());
            //     if (this.mouse.state === 'text') {
            //         // const ourKonvaElement = OurKonvaText.getOurKonvaText(konvaElement.konvaObject as Konva.Text);
            //         // this.addKonvaObjectToMap(ourKonvaElement, map);
            //     }
            //     this.newObjectAddSelectedOption(mouseDown);
            // }
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouse.ev = e;
            this.mouse.mouseMove();
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            if (this.mouse.state !== 'pointer') {
                this.mouse.isActive = false;
                this.mouse.ev = e;
                let konvaElement = this.mouse.mouseUp();
                if (konvaElement.ourKonvaObject.isAdaptedToGrid) {
                    konvaElement = this.adaptObjectToMap(konvaElement); // Adapt object to a grid
                }
                this.addMouseKonvaObjectToMap(konvaElement.ourKonvaObject);
                this.newObjectSetEvents(konvaElement);
            }
        }, false);

        mapEl.nativeElement.addEventListener('mouseout', (e) => {
            this.mouse.isActive = false;
            this.mouse.ev = e;
            this.mouse.mouseOut();
        }, false);
    }

    addMouseKonvaObjectToMap(object: any): void {
        this.socketService.createGameObject(this.currentMap.id, object);
        this.currentMap.objects.push(object.ourKonvaObject);
        this.mouseService.setMouse(new OurKonvaPointer());
    }

    setCtrlKey(isCtrlKey: boolean): void {
        this.isCtrlKeyPressed = isCtrlKey;
    }

    newObjectSetEvents(object: any): void {
        object?.konvaObject.on('mouseover', (e) => {
          document.body.style.cursor = 'pointer';
        });
        object?.konvaObject.on('mouseout', (e) => {
            document.body.style.cursor = 'default';
        });

        object?.konvaObject.on('click', () => {
            if (this.mouse.state !== 'pointer') { return; }
            const selectedObjects = this.selectedKonvaObjects?.getValue();
            const selectedGroup: Konva.Group = object.layer.find('#selectedObjects')[0];
            const selectedGroupTr: Konva.Transformer = object.layer.find('#tr-selectedObjects')[0];

            object.konvaObject.draggable(!object.ourKonvaObject.isEditionBlocked);
            if (this.isCtrlKeyPressed) {
                const objectAlreadySelectedIndex = selectedObjects?.findIndex((o) => {
                    return o.ourKonvaObject.id === object.ourKonvaObject.id;
                });
                if (objectAlreadySelectedIndex >= 0) {
                    selectedObjects.splice(objectAlreadySelectedIndex, 1);
                    object.layer.add(object.konvaObject);
                    selectedGroupTr.nodes([selectedGroup]);
                    object.layer.batchDraw();
                    this.selectedKonvaObjects.next(selectedObjects);
                    return;
                }
            }

            if (!this.isCtrlKeyPressed && selectedGroup.getChildren()) {
                const children = [];
                selectedGroup.getChildren().forEach((o) => {
                    children.push(o);
                    selectedObjects.splice(0, 1);
                });
                children.forEach((o) => {
                    object.layer.add(o);
                });
            }

            if (!object.ourKonvaObject.isEditionBlocked) {
                selectedGroup.add(object.konvaObject);
                selectedObjects.push(object);
                selectedGroup.add(object.konvaObject);
            }

            selectedGroupTr.nodes([selectedGroup]);
            object.layer.batchDraw();
            this.selectedKonvaObjects.next(selectedObjects);
        });
        object?.konvaObject.on('dragend', () => {
            if (object.ourKonvaObject.isAdaptedToGrid) {
                object = this.adaptObjectToMap(object); // Adapt object to a grid
                this.selectedKonvaObjects.next([object]);
            }
            this.socketService.updateGameObject(this.currentMap.id, object.ourKonvaObject);
        });
    }

    applyTransformEndToNewObject(object: any): void {
        object.transformer.on('transformend', (ev) => {
            const selectedObjects = this.selectedKonvaObjects?.getValue();
            const newWidth = Math.round(object.konvaObject.getAttr('width') * ev.target.attrs.scaleX);
            const newHeight = Math.round(object.konvaObject.getAttr('height') * ev.target.attrs.scaleY);
            object.konvaObject.setAttr('scaleX', 1);
            object.konvaObject.setAttr('scaleY', 1);
            object.konvaObject.setAttr('width', newWidth);
            object.konvaObject.setAttr('height', newHeight);
            selectedObjects.forEach((selectedObject) => {
                if (selectedObject.ourKonvaObject.isAdaptedToGrid) {
                    object = this.adaptObjectToMap(object); // Adapt object to a grid
                }
            });
            this.socketService.updateGameObject(this.currentMap.id, object.ourKonvaObject);
        });
    }

    clickMapObject(object: any): void {
        // this.mouseService.setMouse(new OurKonvaPointer());
        // const obj = this.stage.find('#' + object.id)[0];
        // const childrens = obj.getLayer().getChildren().toArray();
        // childrens.forEach(child => {
        //     const id = child.getAttr('id');
        //     if (id.startsWith('tr-')) {
        //         if (id === ('tr-' + obj.getAttr('id'))) {
        //             child.show();
        //             child.getLayer().batchDraw();
        //             const currentSelectedKonvaObject = new CurrentSelectedKonvaObject();
        //             if (object.state === 'square') {
        //                 (obj as Konva.Rect).draggable(true);
        //                 currentSelectedKonvaObject.konvaObject = obj as Konva.Rect;
        //             } else if (object.state === 'image') {
        //                 (obj as Konva.Image).draggable(true);
        //                 currentSelectedKonvaObject.konvaObject = obj as Konva.Image;
        //             } else if (object.state === 'text') {
        //                 (obj as Konva.Text).draggable(true);
        //                 currentSelectedKonvaObject.konvaObject = obj as Konva.Text;
        //             }
        //             currentSelectedKonvaObject.type = object.state;
        //             currentSelectedKonvaObject.layer = child.getLayer();
        //             currentSelectedKonvaObject.transformer = child as Konva.Transformer;
        //             this.selectedKonvaObjects.next(currentSelectedKonvaObject);
        //         } else {
        //             child.hide();
        //             child.getLayer().batchDraw();
        //         }
        //     } else {
        //         if (id !== ('tr-' + obj.getAttr('id'))) {
        //             if (id !== obj.getAttr('id')) {
        //                 child.setAttr('draggable', false);
        //             }
        //         }
        //     }
        // });
        // this.modifyOtherLayers(obj);
    }

    modifyOtherLayers(obj: any): void {
        // const layers = this.stage.getLayers().toArray();
        // const getMyLayerIndex = layers.findIndex(layer => {
        //     return layer.getChildren().toArray().find(child => child.getAttr('id') === obj.getAttr('id'));
        // });
        // layers.splice(getMyLayerIndex, 1);
        // layers.forEach(layer => {
        //     layer.getChildren().toArray().forEach(child => {
        //         if (child.getAttr('id').startsWith('tr-')) {
        //             child.hide();
        //             child.getLayer().batchDraw();
        //         } else {
        //             if (child.getAttr('draggable')) {
        //                 child.setAttr('draggable', false);
        //             }
        //         }
        //     });
        // });
    }

    setStage(stage: Konva.Stage): void {
        this.stage = stage;
    }

    // setSelectedKonvaObject(object: any): void {
    //     if (object.state === 'square') {
    //         console.log('ourKonvaRect =', object);
    //         console.log('selectedKonvaObjects =', this.selectedKonvaObjects.getValue());
    //         // this.selectedKonvaObjects.next(ourKonvaRect);
    //     }
    // }

    // setSelectedKonvaObject(object: CurrentSelectedKonvaObject | null): void {
    //     if (object) {
    //         if (this.selectedKonvaObjects?.getValue()?.konvaObject.getAttr('id') !== object.konvaObject.getAttr('id')) {
    //             if (this.selectedKonvaObjects && this.selectedKonvaObjects.getValue()) {
    //                 this.selectedKonvaObjects.getValue().konvaObject.draggable(false);
    //                 this.selectedKonvaObjects.getValue().transformer.hide();
    //                 this.selectedKonvaObjects.getValue().layer.batchDraw();
    //             }
    //         }
    //         object.konvaObject.draggable(true);
    //         object.transformer.show();
    //         object.layer.batchDraw();
    //     } else {
    //         if (this.selectedKonvaObjects && this.selectedKonvaObjects.getValue()) {
    //             this.selectedKonvaObjects.getValue().konvaObject.draggable(false);
    //             this.selectedKonvaObjects.getValue().transformer.hide();
    //             this.selectedKonvaObjects.getValue().layer.batchDraw();
    //         }
    //     }
    //     this.selectedKonvaObjects.next(object);
    // }

    unsetSelectedKonvaObject(): void {
        console.log('unsetSelectedKonvaObject');
        const selectedKonvaObjects = this.selectedKonvaObjects.getValue();
        if (selectedKonvaObjects) {
            selectedKonvaObjects.forEach((selectedKonvaObject) => {
                selectedKonvaObject.konvaObject.draggable(false);
                selectedKonvaObject.transformer.hide();
                selectedKonvaObject.layer.batchDraw();
            });
        }
        this.selectedKonvaObjects.next([]);
    }

    getSelectedKonvaObjectObservable(): Observable<CurrentSelectedKonvaObject[] | null> {
        return this.selectedKonvaObjects.asObservable();
    }

    paintObjectsOnMap(objects: any, layers: OurKonvaLayers): void {
        objects.forEach((object: any) => {
            this.paintObjectOnMap(object, layers);
        });
    }

    paintObjectOnMap(object: any, layers: OurKonvaLayers): void {
        if (object?.state === 'square') {
            const createdObject = OurKonvaRect.paint(object, layers);
            this.applyTransformEndToNewObject(createdObject);
            this.newObjectSetEvents(createdObject);
        }
        if (object?.state === 'text') {
            const createdObject = OurKonvaText.paint(object, layers);
            this.newObjectSetEvents(createdObject);
        }
        if (object?.state === 'image') {
            const createdObject = OurKonvaImage.paint(object, layers);
            this.newObjectSetEvents(createdObject);
        }
        if (object?.state === 'brush') {
            const createdObject = OurKonvaBrush.paint(object, layers);
            this.newObjectSetEvents(createdObject);
        }
    }

    updateSelectedObject(object: CurrentSelectedKonvaObject[]): void {
        this.selectedKonvaObjects.next(object);
    }

    updateObject(object: OurKonvaMouse): void {
        this.socketService.updateGameObject(this.currentMap.id, object);
    }

    deleteObjectOnMap(mod: OurKonvaMapModification): void {
        const obj = this.stage.find('#' + mod.object.id)[0];
        const childrens = obj?.getLayer().getChildren().slice();
        childrens.forEach(child => {
            const id = child.getAttr('id');
            if (id.startsWith('tr-')) {
                if (id === ('tr-' + mod.object.id)) {
                    const layer = child.getLayer();
                    child.destroy();
                    layer.batchDraw();
                }
            } else {
                if (id === mod.object.id) {
                    const layer = child.getLayer();
                    child.destroy();
                    layer.batchDraw();
                }
            }
        });
    }

    adaptObjectToMap(obj: CurrentSelectedKonvaObject): CurrentSelectedKonvaObject {
        const position = new Coords();
        position.x = Math.round(obj.konvaObject.getAttr('x') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        position.y = Math.round(obj.konvaObject.getAttr('y') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        const width = Math.round(obj.konvaObject.getAttr('width') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        const height = Math.round(obj.konvaObject.getAttr('height') / obj.ourKonvaObject.cellSize) * obj.ourKonvaObject.cellSize;
        obj.konvaObject.setAttr('x', position.x);
        obj.konvaObject.setAttr('y', position.y);
        obj.konvaObject.setAttr('width', width);
        obj.konvaObject.setAttr('height', height);
        this.stage.batchDraw();

        obj.ourKonvaObject.position.x = position.x;
        obj.ourKonvaObject.position.y = position.y;
        obj.ourKonvaObject.size.width = width;
        obj.ourKonvaObject.size.height = height;
        return obj;
    }
}
