import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-custom-list',
    templateUrl: './custom-list.component.html',
    styleUrls: ['./custom-list.component.scss']
})
export class CustomListComponent {

    @Input() items: any[] = [];
    @Input() type: string = 'grid';
    @Input() editable: boolean = false;
    @Output() deleteItemChanges: EventEmitter<any> = new EventEmitter<any>();
    @Input() selectedItem: any = null;
    @Output() selectedItemChanges: EventEmitter<any> = new EventEmitter<any>();

    constructor() {

    }

    selectItem(item: any): void  {
        this.selectedItem = item;
        this.selectedItemChanges.emit(this.selectedItem);
    }

    deleteItem(item: any): void  {
        if (this.selectedItem === item) {
            this.selectedItem = null;
        }
        this.deleteItemChanges.emit(item);
        this.items.splice(this.items.findIndex((_item) => _item === item), 1);
    }
}
