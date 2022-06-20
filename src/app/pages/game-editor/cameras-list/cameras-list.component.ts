import {Component, Input} from '@angular/core';
import {Camera} from '../../../classes/Camera';

@Component({
    selector: 'app-cameras-list',
    templateUrl: './cameras-list.component.html',
    styleUrls: ['./cameras-list.component.scss']
})
export class CamerasListComponent {

    @Input() cameras: Camera[] = [];

    constructor() {

    }

    rename(camera: Camera, ev: any): void {
        console.log('rename');
    }

    delete(camera: Camera, ev: any): void {
        console.log('delete');
    }

}
