import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-properties-list-tools',
    templateUrl: './properties-list-tools.component.html',
    styleUrls: ['./properties-list-tools.component.scss']
})
export class PropertiesListToolsComponent implements OnInit {

    @Input() open = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

}
