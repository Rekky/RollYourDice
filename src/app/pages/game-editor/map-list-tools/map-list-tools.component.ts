import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {OurKonvaMap} from '../../../classes/ourKonva/OurKonvaMap';
import {Subscription} from 'rxjs';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import { MapEditComponent } from './map-edit/map-edit.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-map-list-tools',
    templateUrl: './map-list-tools.component.html',
    styleUrls: ['./map-list-tools.component.scss']
})
export class MapListToolsComponent implements OnInit, OnDestroy {
    @Input() maps: OurKonvaMap[] = [];
    @Input() currentMap: OurKonvaMap = null;
    @Input() tabs: number = 0;
    @Input() displayed: boolean = false;
    @Output() tabsChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() mapsChange: EventEmitter<OurKonvaMap[]> = new EventEmitter<OurKonvaMap[]>();
    @Output() createMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() deleteMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() updateMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() selectedMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() toPlayersMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();

    newMapForm: FormGroup;
    updateMapForm: FormGroup;
    openMapOption: number;
    openObjectOption: number;
    isEditNameDisplayed: boolean = false;

    getSelectedKonvaObjectSubscription: Subscription;

    constructor(private mouseInteractor: MouseInteractor, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe((konva: any) => {
            this.maps?.find(map => {
                const objectToSelect = map.objects.find(object => {
                    return object?.id === konva?.konvaObject.getAttr('id');
                });
            });
        });
        this.updateMapForm = this.newMapForm;
    }

    ngOnDestroy(): void {
        this.getSelectedKonvaObjectSubscription?.unsubscribe();
    }

    // MAPS ===========================================================================================================
    onSelectMap(map: OurKonvaMap, ev?): void {
        ev?.stopPropagation();
        if (this.currentMap.id !== map.id) {
            this.currentMap = map;
            this.selectedMapEvent.emit(this.currentMap);
        }
    }

    createMap(): void {
        const newMap = new OurKonvaMap();
        this.maps.push(newMap);
        this.createMapEvent.emit(newMap);
    }

    editMap(map: OurKonvaMap): void {
        this.updateMapEvent.emit(map);
        this.currentMap = map;
        this.selectedMapEvent.emit(this.currentMap);
    }

    deleteMap(map: OurKonvaMap, e?): void {
        e?.stopPropagation();
        this.openMapOption = null;
        this.maps.splice(this.maps.indexOf(map), 1);
        this.deleteMapEvent.emit(map);
    }

    toggleMapOption(map: OurKonvaMap, option: number, e?): void {
        e?.stopPropagation();
        if (this.openMapOption === option) {
            this.openMapOption = null;
        }
        else {
            this.openMapOption = option;
        }
    }

    onDragulaMapsChange(maps: any): void {
        this.maps = maps;
        this.mapsChange.emit(this.maps);
    }

    // OBJECTS ==========================================================================================================
    editObject(obj?: any, e?): void {}
    deleteObject(obj: any, e?): void {
        this.currentMap.objects.splice(this.currentMap.objects.indexOf(obj), 1);
    }

    toggleObjectOption(object: any, option: number, e?): void {
        e?.stopPropagation();
        if (this.openObjectOption === option) {
            this.openObjectOption = null;
        }
        else {
            this.openObjectOption = option;
        }
    }

    // OTHERS ===========================================================================================================
    toPlayersMap(map: OurKonvaMap): void {
        // map.toPlayers = !map.toPlayers;
        this.toPlayersMapEvent.emit(map);
    }
}
