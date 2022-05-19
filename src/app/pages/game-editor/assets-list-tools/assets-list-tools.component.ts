import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-assets-list-tools',
    templateUrl: './assets-list-tools.component.html',
    styleUrls: ['./assets-list-tools.component.scss']
})
export class AssetsListToolsComponent implements OnInit {

    @Input() open = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onOpenChange(ev: boolean): void {
        this.open = ev;
        this.openChange.emit(this.open);
    }

}
