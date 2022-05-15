import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-objects-list-tools',
    templateUrl: './objects-list-tools.component.html',
    styleUrls: ['./objects-list-tools.component.scss']
})
export class ObjectsListToolsComponent implements OnInit {

    @Input() open = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

}
