import {Injectable} from '@angular/core';
import {MapService} from '../services/map.service';
import { Coords } from '../classes/Coords';
import {SocketService} from '../services/socket.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {OurKonvaLayers} from '../classes/ourKonva/OurKonvaLayers';
import Konva from 'konva';
import {OurKonvaRect} from '../classes/ourKonva/OurKonvaRect';

@Injectable({
    providedIn: 'root'
})
export class MapInteractor {

    constructor(private mapService: MapService,
                private socketService: SocketService) {
    }

    setMapPosition(id: string | number, pos: Coords): void {
        this.mapService.setMapPosition(id, pos);
    }

    sendSocketObjectPosition(object: any): void {
        // this.socketService.sendSocketObject(object);
    }

    getSocketObjectPosition(): Observable<any> {
        return this.socketService.gameSocketObjectSubscription;
    }

    paintObjectsOnMap(objects: any, grid: Konva.Stage, layers: OurKonvaLayers): void {
        objects.forEach((object: any) => {
            this.paintObjectOnMap(object, grid, layers);
        });
    }

    paintObjectOnMap(object: any, stage: Konva.Stage, layers: OurKonvaLayers): void {
        if (object.state === 'square') {
            OurKonvaRect.paint(object, stage, layers);
        }
    }
}
