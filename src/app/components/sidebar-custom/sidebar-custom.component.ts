import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sidebar-custom',
    templateUrl: './sidebar-custom.component.html',
    styleUrls: ['./sidebar-custom.component.scss']
})
export class SidebarCustomComponent implements OnInit {

    @Input() top: string = '0px';
    @Input() sidebarType: string = 'left';
    @Input() title = null;
    @Input() open = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.open = false;
        this.openChange.emit(this.open);
    }

}
