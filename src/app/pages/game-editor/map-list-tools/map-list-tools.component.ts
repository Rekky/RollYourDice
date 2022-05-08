import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Coords} from '../../../classes/Coords';
import {OurKonvaMap} from '../../../classes/ourKonva/OurKonvaMap';
import Konva from 'konva';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {Game} from '../../../classes/Game';
import {Subscription} from 'rxjs';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import { MapInteractor } from 'src/app/interactors/MapInteractor';

@Component({
    selector: 'app-map-list-tools',
    templateUrl: './map-list-tools.component.html',
    styleUrls: ['./map-list-tools.component.scss']
})
export class MapListToolsComponent implements OnInit, OnDestroy {

    @Input() open = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() openModal = false;

    @Input() maps: OurKonvaMap[] = [];
    @Output() createMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() deleteMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() updateMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() mapsChanges: EventEmitter<OurKonvaMap[]> = new EventEmitter<OurKonvaMap[]>();
    @Output() selectedMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();
    @Output() toPlayersMapEvent: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();

    @Input() currentMap: OurKonvaMap = null;
    newMapForm: FormGroup;
    updateMapForm: FormGroup;
    isUpdateMap = false;

    getSelectedKonvaObjectSubscription: Subscription;

    constructor(private mouseInteractor: MouseInteractor) { }

    ngOnInit(): void {
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe((konva: any) => {
            this.maps?.find(map => {
                const objectToSelect = map.objects.find(object => {
                    return object.id === konva?.konvaObject.getAttr('id');
                });
            });
        });
        this.newMapForm = new FormGroup({
            name: new FormControl('New Map', Validators.required),
            nRows: new FormControl('50', Validators.required),
            nColumns: new FormControl('50', Validators.required)
        });
        this.updateMapForm = this.newMapForm;
    }

    ngOnDestroy(): void {
        this.getSelectedKonvaObjectSubscription?.unsubscribe();
    }

    onSelectMap(ev, map: OurKonvaMap): void {
        ev.stopPropagation();
        this.currentMap = map;
        this.selectedMapEvent.emit(this.currentMap);
    }

    submitMapForm(): void {
        // update map
        if(this.isUpdateMap) {
            if(!this.updateMapForm.valid) {
                return;
            }
            this.currentMap.name = this.newMapForm.get('name').value;
            this.currentMap.nRows = this.newMapForm.get('nRows').value;
            this.currentMap.nColumns = this.newMapForm.get('nColumns').value;
            this.updateMapEvent.emit(this.currentMap);
            this.openModal = false;
            return;
        }

        // create new map
        const newMap: OurKonvaMap = new OurKonvaMap();
        newMap.name = this.newMapForm.get('name').value;
        newMap.nRows = this.newMapForm.get('nRows').value;
        newMap.nColumns = this.newMapForm.get('nColumns').value;

        if(!this.newMapForm.valid) {
            return;
        }

        this.maps.push(newMap);
        this.createMapEvent.emit(newMap);

        this.newMapForm.reset();
        this.openModal = false;
    }

    deleteMap(map: OurKonvaMap): void {
        this.maps.splice(this.maps.indexOf(map), 1);
        this.deleteMapEvent.emit(map);
    }

    openUpdateMapModal(map: OurKonvaMap): void {
        this.openModal = true;
        this.isUpdateMap = true;
        this.updateMapForm.patchValue(map);
    }

    toPlayersMap(map: OurKonvaMap): void {
        // map.toPlayers = !map.toPlayers;
        this.toPlayersMapEvent.emit(map);
    }

}
