import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Page} from '../../../classes/Page';
import {Coords} from '../../../classes/Coords';
import {OurKonvaMap} from '../../../classes/ourKonva/OurKonvaMap';
import {OurKonvaObject} from '../../../classes/ourKonva/OurKonvaObject';

@Component({
    selector: 'app-maps-list',
    templateUrl: './maps-list.component.html',
    styleUrls: ['./maps-list.component.scss']
})
export class MapsListComponent implements OnInit {

    @Input() maps: OurKonvaMap[] = [];
    @Output() selectedMap: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    currentMap: OurKonvaMap = null;
    currentMapObject: OurKonvaObject = null;

    showNewMapForm: boolean = false;
    newMapForm: FormGroup;

    constructor() { }

    ngOnInit(): void {
        this.newMapForm = new FormGroup({
            name: new FormControl('Map' + (this.maps.length + 1)),
        });
    }

    onSelectMap(ev, map: OurKonvaMap): void {
        console.log('entras select map', map);
        ev.stopPropagation();
        this.currentMap = map;
        this.currentMapObject = null;
        this.selectedMap.emit(this.currentMap);
    }

    onAddNewMap(): void {
        const newMap: OurKonvaMap = new OurKonvaMap();
        newMap.position = new Coords(300, 10, 0);
        newMap.name = this.newMapForm.get('name').value;

        this.maps.push(newMap);
        this.newMapForm.reset({name: 'Map' + (this.maps.length + 1)});
        this.showNewMapForm = false;
    }

    onSelectMapObject(ev, mapObject: OurKonvaObject): void {
        console.log('entras select object', mapObject);
        ev.stopPropagation();
        this.currentMapObject = mapObject;
        this.currentMap = null;
    }

}
