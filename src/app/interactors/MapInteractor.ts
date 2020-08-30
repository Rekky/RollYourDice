import {Injectable} from '@angular/core';
import {MapService} from '../services/map.service';
import { Coords } from '../classes/Coords';

@Injectable({
    providedIn: 'root'
})
export class MapInteractor {

    constructor(private mapService: MapService) {

    }

    setMapPosition(id: string | number, pos: Coords): void {
        this.mapService.setMapPosition(id, pos);
    }
}
