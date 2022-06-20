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
    mouseIsOverKonvaObjectId: string;

    constructor(private mouseService: MouseService,
                private mapObjectService: MapObjectService,
                private socketService: SocketService) {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
                this.mouse = res;
            }
        });
        this.selectedKonvaObjectSubscription = this.getSelectedKonvaObjectObservable().subscribe(
            (selectedObjects: CurrentSelectedKonvaObject[]) => {
            if (selectedObjects) {
                document.onkeyup = (ev) => {
                    if (ev.key === 'Delete' && document.activeElement.tagName !== 'INPUT') {
                        const ourSelectedKonvaObjects = selectedObjects.map(obj => obj.ourKonvaObject);
                        this.socketService.deleteGameObject(this.currentMap.id, ourSelectedKonvaObjects);
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
        }, false);

        mapEl.nativeElement.addEventListener('mousemove', (e) => {
            this.mouse.ev = e;
            this.mouse.mouseMove();

            if (this.mouse.isActive && this.mouse.state === 'pointer') {
                const selectedObjects = this.selectedKonvaObjects.getValue();
                const nodes = selectedGroupTr.getNodes();
                const mapObjects = layers.draws.getChildren();
                const mouse = this.mouse as OurKonvaPointer;
                mapObjects.forEach((object, i) => {
                    const isObjectSelected = nodes.find(selObj => {
                        return object.getAttr('id') === selObj.getAttr('id');
                    });
                    if (object.getAttr('id') === 'tr-selectedObjects' || i === mapObjects.length - 1) {
                        return;
                    }
                    if (this.isHitCheck(object, mouse.tempRect) && !isObjectSelected) {
                        selectedGroupTr.nodes(nodes.concat([object]));
                        // const toEmit = new CurrentSelectedKonvaObject();
                        // const ourKonvaObject = map.objects.find(obj => obj.id === object.getAttr('id'));
                        // toEmit.ourKonvaObject = ourKonvaObject;
                        // toEmit.konvaObject = object;
                        // toEmit.type = object.getAttr('type');
                        // toEmit.layer = layers.draws;
                        // selectedObjects.push(toEmit);
                        // this.selectedKonvaObjects.next(selectedObjects);
                    }
                    if (!this.isHitCheck(object, mouse.tempRect) && isObjectSelected) {
                        const selectObjIndex = nodes.findIndex(selObj => {
                            return object.getAttr('id') === selObj.getAttr('id');
                        });
                        nodes.splice(selectObjIndex, 1);
                        selectedGroupTr.nodes(nodes);
                    }
                });
            }
        }, false);

        mapEl.nativeElement.addEventListener('mouseup', (e) => {
            let konvaElement = this.mouse.mouseUp();
            this.mouse.isActive = false;
            this.mouse.ev = e;
            if (this.mouse.state === 'pointer') {
                this.mouseService.setMouse(new OurKonvaPointer());
                return;
            }
            if (this.mouse.state !== 'pointer') {
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

        const selectedGroupTr: Konva.Transformer = layers.draws.getChildren()[0] as Konva.Transformer;
        selectedGroupTr?.on('transformend', (ev) => {
            const selectedGroup = selectedGroupTr.getNodes();
            const selectedObjects = this.selectedKonvaObjects?.getValue();
            const scale: {scaleX: number, scaleY: number} = {
                scaleX: ev.target.attrs.scaleX,
                scaleY: ev.target.attrs.scaleY
            };
            selectedGroup.forEach(object => {
                const newWidth = Math.round(object.getAttr('width') * scale.scaleX);
                const newHeight = Math.round(object.getAttr('height') * scale.scaleY);
                object.setAttr('scaleX', 1);
                object.setAttr('scaleY', 1);
                object.setAttr('width', newWidth);
                object.setAttr('height', newHeight);

                let mySelectedObjectReference = selectedObjects.find(obj => obj.ourKonvaObject.id === object.getAttr('id'));
                mySelectedObjectReference.konvaObject = object;
                mySelectedObjectReference.ourKonvaObject.size.width = newWidth;
                mySelectedObjectReference.ourKonvaObject.size.height = newHeight;
                if (mySelectedObjectReference.ourKonvaObject.isAdaptedToGrid) {
                    mySelectedObjectReference = this.adaptObjectToMap(mySelectedObjectReference); // Adapt object to a grid
                }
            });

            this.selectedKonvaObjects.next(selectedObjects);
            const ourSelectedKonvaObjects = selectedObjects.map(obj => obj.ourKonvaObject);
            this.socketService.updateGameObjects(this.currentMap.id, ourSelectedKonvaObjects);
        });
    }

    isHitCheck(shape1, shape2): boolean{
        const s1 = shape1.getClientRect(); // use this to get bounding rect for shapes other than rectangles.
        const s2 = shape2.getClientRect();

        // console.log(s1, s2);

        // corners of shape 1
        const X = s1.x;
        const Y  = s1.y;
        const A = s1.x + s1.width;
        const B = s1.y + s1.height;

        // corners of shape 2
        const X1 = s2.x;
        const A1 = s2.x + s2.width;
        const Y1 = s2.y;
        const B1 = s2.y + s2.height;
        // console.log(A < X1, A1 < X, B < Y1, B1 < Y);

        // Simple overlapping rect collision test
        if (A < X1 || A1 < X || B < Y1 || B1 < Y) {
            return false;
        }
        else{
            return true;
        }

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
        const selectedGroupTr: Konva.Transformer = object.layer.find('#tr-selectedObjects')[0];
        object?.konvaObject.on('mouseover', (e) => {
            if (!object.ourKonvaObject.isEditionBlocked) {
                document.body.style.cursor = 'pointer';
            }
            this.mouseIsOverKonvaObjectId = object.ourKonvaObject.id;
        });
        object?.konvaObject.on('mouseout', (e) => {
            this.mouseIsOverKonvaObjectId = null;
            document.body.style.cursor = 'default';
        });
        object?.konvaObject.on('click', () => {
            if (this.mouse.state !== 'pointer') { return; }
            const nodes = selectedGroupTr.getNodes();
            const selectedObjects = this.selectedKonvaObjects?.getValue();

            if (this.isCtrlKeyPressed) {
                const objectAlreadySelectedIndex = selectedObjects?.findIndex((o) => {
                    return o.ourKonvaObject.id === object.ourKonvaObject.id;
                });
                if (objectAlreadySelectedIndex >= 0) {
                    selectedObjects.splice(objectAlreadySelectedIndex, 1);
                    nodes.splice(objectAlreadySelectedIndex, 1);
                    object.layer.add(object.konvaObject);
                    selectedGroupTr.nodes(nodes);
                    object.layer.batchDraw();
                    this.selectedKonvaObjects.next(selectedObjects);
                    return;
                }
            }

            if (!this.isCtrlKeyPressed && nodes) {
                const children = [];
                nodes.forEach((o) => {
                    children.push(o);
                    object.layer.add(o);
                    selectedObjects.splice(0, 1);
                });
                children.forEach((o) => {
                    nodes.splice(0, 1);
                });
            }

            if (!object.ourKonvaObject.isEditionBlocked) {
                selectedObjects.push(object);
                selectedGroupTr.nodes(nodes.concat([object.konvaObject]));
            }
            object.layer.batchDraw();
            this.selectedKonvaObjects.next(selectedObjects);
        });
        object?.konvaObject.on('dragend', () => {
            if (object.ourKonvaObject.isAdaptedToGrid) {
                object = this.adaptObjectToMap(object); // Adapt object to a grid
                // this.selectedKonvaObjects.next([object]);
            }
            const selectedObjects = this.selectedKonvaObjects?.getValue();
            const amITheLastElement = selectedObjects[selectedObjects.length - 1]?.ourKonvaObject.id === object.ourKonvaObject.id;
            const amIThePreLastElement = selectedObjects[selectedObjects.length - 2]?.ourKonvaObject.id === object.ourKonvaObject.id;
            const isMouseDraggingLastElement = selectedObjects[selectedObjects.length - 1].ourKonvaObject.id === this.mouseIsOverKonvaObjectId;

            if (selectedObjects.length > 1 && isMouseDraggingLastElement && amITheLastElement) { return; }

            if (isMouseDraggingLastElement && amIThePreLastElement) {
                const ourSelectedKonvaObjectsPre = selectedObjects.map(obj => obj.ourKonvaObject);
                this.socketService.updateGameObjects(this.currentMap.id, ourSelectedKonvaObjectsPre);
                return;
            }

            if (!amITheLastElement) { return; }

            const ourSelectedKonvaObjects = selectedObjects.map(obj => obj.ourKonvaObject);
            this.socketService.updateGameObjects(this.currentMap.id, ourSelectedKonvaObjects);
        });
    }

    setStage(stage: Konva.Stage): void {
        this.stage = stage;
    }

    unsetSelectedKonvaObject(): void {
        const selectedKonvaObjects = this.selectedKonvaObjects.getValue();
        if (selectedKonvaObjects.length > 0) {
            selectedKonvaObjects.forEach((selectedKonvaObject) => {
                selectedKonvaObject.konvaObject.draggable(false);
                selectedKonvaObject.layer.batchDraw();
            });

            const selectedGroupTr: Konva.Transformer = selectedKonvaObjects[0].layer.getChildren()[0] as Konva.Transformer;
            selectedGroupTr.nodes([]);
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
        this.socketService.updateGameObjects(this.currentMap.id, [object]);
    }

    deleteObjectOnMap(selectedObject: any): void {
        console.log(selectedObject);
        const obj = this.stage.find('#' + selectedObject.id)[0];
        const childrens = obj?.getLayer().getChildren().slice();
        childrens.forEach(child => {
            const id = child.getAttr('id');
            if (id === selectedObject.id) {
                const layer = child.getLayer();
                child.destroy();
                layer.batchDraw();
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
