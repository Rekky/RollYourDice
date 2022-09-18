import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-custom-list',
    templateUrl: './custom-list.component.html',
    styleUrls: ['./custom-list.component.scss']
})
export class CustomListComponent {

    @Input() items: any[] = [];
    @Input() type: string = 'grid';
    @Input() selectedItem: any = null;
    @Output() selectedItemChanges: EventEmitter<any> = new EventEmitter<any>();

    constructor() {

    }

    selectItem(item: any): void  {
        this.selectedItem = item;
        this.selectedItemChanges.emit(this.selectedItem);
    }
}
