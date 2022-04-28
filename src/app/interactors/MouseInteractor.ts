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

@Injectable({
    providedIn: 'root'
})
export class MouseInteractor implements OnDestroy {
    private selectedKonvaObject: BehaviorSubject<CurrentSelectedKonvaObject | null> = new BehaviorSubject<CurrentSelectedKonvaObject | null>(null);

    mouse: OurKonvaMouse | OurKonvaRect | OurKonvaText | OurKonvaImage;

    getMouseObservableSubscription: Subscription;
    selectedKonvaObjectSubscription: Subscription;

    stage: Konva.Stage;
    currentMap: OurKonvaMap = null;

    constructor(private mouseService: MouseService,
                private mapObjectService: MapObjectService,
                private socketService: SocketService) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
                this.mouse = res;
            }
        });
        this.selectedKonvaObjectSubscription = this.getSelectedKonvaObjectObservable().subscribe((object: CurrentSelectedKonvaObject) => {
            if (object !== null) {
                document.onkeyup = (ev) => {
                    if (ev.key === 'Delete' && document.activeElement.tagName !== 'INPUT') {
                        const objectToEmit = object.ourKonvaObject;
                        this.socketService.deleteGameObject(this.currentMap.id, objectToEmit);
                        this.selectedKonvaObject.next(null);
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
                this.selectedKonvaObject.next(null);
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
                this.newObjectAddSelectedOption(konvaElement);
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

    newObjectAddSelectedOption(object: any): void {
        object?.konvaObject.on('click', () => {
            const selectedObject = this.selectedKonvaObject?.getValue();
            if (selectedObject?.konvaObject.getAttr('id') !== object.konvaObject.getAttr('id')) {
                if (selectedObject) {
                    selectedObject.konvaObject.draggable(false);
                    selectedObject.transformer.hide();
                    selectedObject.layer.batchDraw();
                }
            }

            object.konvaObject.draggable(!object.ourKonvaObject.isEditionBlocked);
            if (!object.ourKonvaObject.isEditionBlocked) {
                object.transformer.show();
            }
            object.layer.batchDraw();
            this.selectedKonvaObject.next(object);
        });
        object?.konvaObject.on('dragend', () => {
            if (object.ourKonvaObject.isAdaptedToGrid) {
                object = this.adaptObjectToMap(object); // Adapt object to a grid
            }
            // const ourKonvaRect = new OurKonvaRect(this.user).getOurKonvaRect(object.konvaObject as Konva.Rect);
            this.socketService.updateGameObject(this.currentMap.id, object.ourKonvaObject);
        });
    }

    applyTransformEndToNewObject(object: any): void {
        object.transformer.on('transformend', (ev) => {
            const selectedObject = this.selectedKonvaObject?.getValue();
            const newWidth = Math.round(object.konvaObject.getAttr('width') * ev.target.attrs.scaleX);
            const newHeight = Math.round(object.konvaObject.getAttr('height') * ev.target.attrs.scaleY);
            object.konvaObject.setAttr('scaleX', 1);
            object.konvaObject.setAttr('scaleY', 1);
            object.konvaObject.setAttr('width', newWidth);
            object.konvaObject.setAttr('height', newHeight);
            if (selectedObject.ourKonvaObject.isAdaptedToGrid) {
                object = this.adaptObjectToMap(object); // Adapt object to a grid
            }
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
        //             this.selectedKonvaObject.next(currentSelectedKonvaObject);
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
    //         console.log('selectedKonvaObject =', this.selectedKonvaObject.getValue());
    //         // this.selectedKonvaObject.next(ourKonvaRect);
    //     }
    // }

    // setSelectedKonvaObject(object: CurrentSelectedKonvaObject | null): void {
    //     if (object) {
    //         if (this.selectedKonvaObject?.getValue()?.konvaObject.getAttr('id') !== object.konvaObject.getAttr('id')) {
    //             if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
    //                 this.selectedKonvaObject.getValue().konvaObject.draggable(false);
    //                 this.selectedKonvaObject.getValue().transformer.hide();
    //                 this.selectedKonvaObject.getValue().layer.batchDraw();
    //             }
    //         }
    //         object.konvaObject.draggable(true);
    //         object.transformer.show();
    //         object.layer.batchDraw();
    //     } else {
    //         if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
    //             this.selectedKonvaObject.getValue().konvaObject.draggable(false);
    //             this.selectedKonvaObject.getValue().transformer.hide();
    //             this.selectedKonvaObject.getValue().layer.batchDraw();
    //         }
    //     }
    //     this.selectedKonvaObject.next(object);
    // }

    unsetSelectedKonvaObject(): void {
        if (this.selectedKonvaObject && this.selectedKonvaObject.getValue()) {
            this.selectedKonvaObject.getValue().konvaObject.draggable(false);
            this.selectedKonvaObject.getValue().transformer.hide();
            this.selectedKonvaObject.getValue().layer.batchDraw();
        }
        this.selectedKonvaObject.next(null);
    }

    getSelectedKonvaObjectObservable(): Observable<CurrentSelectedKonvaObject | null> {
        return this.selectedKonvaObject.asObservable();
    }

    paintObjectsOnMap(objects: any, layers: OurKonvaLayers): void {
        objects.forEach((object: any) => {
            this.paintObjectOnMap(object, layers);
        });
    }

    paintObjectOnMap(object: any, layers: OurKonvaLayers): void {
        if (object.state === 'square') {
            const createdObject = OurKonvaRect.paint(object, layers);
            this.applyTransformEndToNewObject(createdObject);
            this.newObjectAddSelectedOption(createdObject);
        }
        else if (object.state === 'text') {
            const createdObject = OurKonvaText.paint(object, layers);
            this.newObjectAddSelectedOption(createdObject);
        }
        else if (object.state === 'image') {
            const createdObject = OurKonvaImage.paint(object, layers);
            this.newObjectAddSelectedOption(createdObject);
        }
    }

    updateSelectedObject(object: CurrentSelectedKonvaObject): void {
        this.selectedKonvaObject.next(object);
    }

    updateObject(object: OurKonvaMouse): void {
        this.socketService.updateGameObject(this.currentMap.id, object);
    }

    deleteObjectOnMap(mod: OurKonvaMapModification): void {
        const obj = this.stage.find('#' + mod.object.id)[0];
        const childrens = obj.getLayer().getChildren().slice();
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
