import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
    selector: 'app-objects-list',
    templateUrl: './objects-list.component.html',
    styleUrls: ['./objects-list.component.scss']
})
export class ObjectsListComponent implements OnInit {

    @Input() objects: any[] = [];
    @Output() objectsChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() currentObject: any = null;

    constructor() {
    }

    ngOnInit(): void {
    }

    editObject(obj?: any, e?): void {
        e.stopPropagation();
        // nothing
    }
    deleteObject(obj: any, e?): void {
        e.stopPropagation();
        this.objects.splice(this.objects.indexOf(obj), 1);
        this.objectsChange.emit(this.objects);
    }

}
