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
import {EditGameDataComponent} from '../../../components/edit-game-data/edit-game-data.component';
import { MapEditComponent } from './map-edit/map-edit.component';
import {MatDialog} from '@angular/material/dialog';

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
    openOption: number;

    getSelectedKonvaObjectSubscription: Subscription;

    constructor(private mouseInteractor: MouseInteractor,
                private dialog: MatDialog) { }

    ngOnInit(): void {
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe((konva: any) => {
            this.maps?.find(map => {
                const objectToSelect = map.objects.find(object => {
                    return object.id === konva?.konvaObject.getAttr('id');
                });
            });
        });
        this.updateMapForm = this.newMapForm;
    }

    ngOnDestroy(): void {
        this.getSelectedKonvaObjectSubscription?.unsubscribe();
    }

    onSelectMap(map: OurKonvaMap, ev?): void {
        ev?.stopPropagation();
        if (this.currentMap.id !== map.id) {
            this.currentMap = map;
            this.selectedMapEvent.emit(this.currentMap);
        }
    }

    editMap(map?: OurKonvaMap): void {
        const dialogSub = this.dialog.open(MapEditComponent, {
            data: {
                map: this.isUpdateMap ? map : new OurKonvaMap(),
                title: this.isUpdateMap ? 'Edit map' : 'Create map'
            }
        }).afterClosed().subscribe(res => {
            if (res) {
                if (this.isUpdateMap) {
                    this.updateMapEvent.emit(res.map);
                    this.onSelectMap(res.map);
                }
                else {
                    this.maps.push(res.map);
                    this.createMapEvent.emit(res.map);
                }
            }
            dialogSub.unsubscribe();
        });
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

    toggleOpenOption(n: number): void {
        this.openOption === n ? this.openOption = null : this.openOption = n;
    }

}
