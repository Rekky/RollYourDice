import {Component, Input, OnInit} from '@angular/core';
import {Camera} from '../../../classes/Camera';

@Component({
    selector: 'app-cameras-list',
    templateUrl: './cameras-list.component.html',
    styleUrls: ['./cameras-list.component.scss']
})
export class CamerasListComponent implements OnInit {

    @Input() cameras: Camera[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }

}
