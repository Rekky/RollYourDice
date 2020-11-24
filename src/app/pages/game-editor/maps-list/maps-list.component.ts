import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Page} from '../../../classes/Page';
import {Coords} from '../../../classes/Coords';
import {OurKonvaMap} from '../../../classes/ourKonva/OurKonvaMap';
import {OurKonvaObject} from '../../../classes/ourKonva/OurKonvaObject';
import Konva from 'konva';

@Component({
    selector: 'app-maps-list',
    templateUrl: './maps-list.component.html',
    styleUrls: ['./maps-list.component.scss']
})
export class MapsListComponent implements OnInit {

    @Input() maps: OurKonvaMap[] = [];
    @Output() newMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() removeMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() renameMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() mapsChanges: EventEmitter<OurKonvaMap[]> = new EventEmitter<OurKonvaMap[]>();
    @Output() selectedMap: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() toPlayersMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    currentMap: OurKonvaMap = null;
    currentMapObject: OurKonvaObject = null;

    showNewMapForm: boolean = false;
    showRenameMapForm: boolean = false;

    newMapForm: FormGroup;
    selectedItemsArray: any[] = [];

    renameMapForm: FormGroup;
    mapToRename: OurKonvaMap;

    constructor() { }

    ngOnInit(): void {
        this.newMapForm = new FormGroup({
            name: new FormControl('Map' + (this.maps.length + 1)),
        });
    }

    onSelectMap(ev, map: OurKonvaMap): void {
        ev.stopPropagation();
        this.currentMap = map;
        this.selectedMap.emit(this.currentMap);
    }

    openListItem(ev: any, item: any): void {
        ev.stopPropagation();
        // this.currentMap = this.currentMap !== item ? item : null;
        const foundItem = this.selectedItemsArray.find((res) => res === item);
        if (foundItem) {
            this.selectedItemsArray.splice(item, 1);
            return;
        }
        this.selectedItemsArray.push(item);
    }

    onSubmitRenameMap(map: OurKonvaMap): void {
        const newName = this.renameMapForm.get('name').value;
        const pageIndex = this.maps.indexOf(map);
        this.maps[pageIndex].name = newName;
        this.showRenameMapForm = false;

        this.renameMapEvent.emit(this.maps[pageIndex]);
    }

    onAddNewMap(): void {
        const newMap: OurKonvaMap = new OurKonvaMap();
        newMap.id = '' + Math.floor(Math.random() * -1000);
        newMap.position = new Coords(300, 10, 0);
        newMap.name = this.newMapForm.get('name').value;

        this.maps.push(newMap);
        this.newMapForm.reset({name: 'Map' + (this.maps.length + 1)});
        this.newMapEvent.emit(newMap);
        this.showNewMapForm = false;
    }

    onSelectMapObject(ev, mapObject: OurKonvaObject): void {
        ev.stopPropagation();
        this.currentMap = null;
    }

    removeMap(map: OurKonvaMap): void {
        console.log('removed');
        this.maps.splice(this.maps.indexOf(map), 1);
        this.removeMapEvent.emit(map);
    }

    renameMap(map: OurKonvaMap): void {
        this.showRenameMapForm = true;
        this.mapToRename = map;
        this.renameMapForm = new FormGroup({
            name: new FormControl(map.name),
        });
    }

    toPlayersMap(map: OurKonvaMap): void {
        map.toPlayers = !map.toPlayers;
        this.toPlayersMapEvent.emit(map);
    }

}
