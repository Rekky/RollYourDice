import {Component, Input} from '@angular/core';
import {Camera} from '../../../classes/Camera';

@Component({
    selector: 'app-cameras-list',
    templateUrl: './cameras-list.component.html',
    styleUrls: ['./cameras-list.component.scss']
})
export class CamerasListComponent {

    @Input() cameras: Camera[] = [
        new Camera('1233', 'Camera Test 1'),
        new Camera('34234', 'Camera test 2'),
        new Camera('567567', 'Camera test 3'),
        new Camera('567567', 'Camera test 4'),
        new Camera('567567', 'Camera test 5'),
        new Camera('567567', 'Camera test 6'),
        new Camera('567567', 'Camera test 7'),
    ];

    constructor() {

    }

    rename(camera: Camera, ev: any): void {
        console.log('rename');
    }

    delete(camera: Camera, ev: any): void {
        console.log('delete');
    }

}
