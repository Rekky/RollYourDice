import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Map} from '../../../classes/Map';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-maps-list',
    templateUrl: './maps-list.component.html',
    styleUrls: ['./maps-list.component.scss']
})
export class MapsListComponent implements OnInit {

    @Input() maps: Map[] = [];
    @Output() selectedMap: EventEmitter<Map> = new EventEmitter<Map>();
    currentMap: Map = null;

    showNewMapForm: boolean = false;
    newMapForm: FormGroup;

    constructor() { }

    ngOnInit(): void {
        this.newMapForm = new FormGroup({
            name: new FormControl(`Map$(this.maps.length + 1)`),
        });
    }

    onSelectMap(map: Map): void {
        this.currentMap = map;
        this.selectedMap.emit(this.currentMap);
    }

    onAddNewMap(): void {

    }

}
