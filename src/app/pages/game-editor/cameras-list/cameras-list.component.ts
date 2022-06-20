import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Camera} from '../../../classes/Camera';
import {SocketService} from '../../../services/socket.service';
import {MapInteractor} from '../../../interactors/MapInteractor';
import {ulid} from 'ulid';

@Component({
    selector: 'app-cameras-list',
    templateUrl: './cameras-list.component.html',
    styleUrls: ['./cameras-list.component.scss']
})
export class CamerasListComponent {

    @Input() cameras: Camera[] = [];
    @Output() camerasChange: EventEmitter<Camera[]> = new EventEmitter<Camera[]>();
    @Output() createCameraEvent: EventEmitter<Camera> = new EventEmitter<Camera>();
    @Output() renameCameraEvent: EventEmitter<Camera> = new EventEmitter<Camera>();
    @Output() deleteCameraEvent: EventEmitter<Camera> = new EventEmitter<Camera>();

    constructor(private socketService: SocketService, private mapInteractor: MapInteractor) {

    }

    createCamera(): void {
        const newCamera = new Camera(ulid(), 'new Camera');
        this.cameras.push(newCamera);
        const mapId = this.mapInteractor.getCurrentMap().id;
        this.socketService.createCamera(mapId, newCamera);
    }

    rename(camera: Camera, ev: any): void {
        ev.stopPropagation();
        const mapId = this.mapInteractor.getCurrentMap().id;
        this.socketService.updateCamera(mapId, camera);
    }

    delete(camera: Camera, ev: any): void {
        ev.stopPropagation();
        const mapId = this.mapInteractor.getCurrentMap().id;
        this.socketService.deleteCamera(mapId, camera);
        this.cameras.splice(this.cameras.indexOf(camera), 1);
    }

}
