import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Map} from '../../../classes/Map';
import {FormControl, FormGroup} from '@angular/forms';
import {Page} from '../../../classes/Page';
import {Coords} from '../../../classes/Coords';

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
            name: new FormControl('Map' + (this.maps.length + 1)),
        });
    }

    onSelectMap(map: Map): void {
        this.currentMap = map;
        this.selectedMap.emit(this.currentMap);
    }

    onAddNewMap(): void {
        const newMap: Map = new Map();
        newMap.id = '-' + Math.floor(Math.random() * 1000);
        newMap.position = new Coords(300, 10, 0);
        newMap.name = this.newMapForm.get('name').value;
        this.maps.push(newMap);
        this.newMapForm.reset({name: 'Map' + (this.maps.length + 1)});
        this.showNewMapForm = false;;
    }

}
