import {Injectable} from '@angular/core';
import {MapService} from '../services/map.service';
import { Coords } from '../classes/Coords';
import {SocketService} from '../services/socket.service';

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
        this.socketService.sendSocketObject(object);
    }
}
