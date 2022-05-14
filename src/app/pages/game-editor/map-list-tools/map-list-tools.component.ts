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
                    return object?.id === konva?.konvaObject.getAttr('id');
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

    editMap(map?: OurKonvaMap, e?): void {
        e?.stopPropagation();
        this.openOption = null;
        const dialogSub = this.dialog.open(MapEditComponent, {
            data: {
                map: map ? map : new OurKonvaMap(),
                title: map ? 'Edit map' : 'Create map'
            }
        }).afterClosed().subscribe(res => {
            if (res) {
                if (map) {
                    this.updateMapEvent.emit(res.map);
                    this.currentMap = res.map;
                    this.selectedMapEvent.emit(this.currentMap);
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
        this.openOption = null;
        this.maps.splice(this.maps.indexOf(map), 1);
        this.deleteMapEvent.emit(map);
    }

    toPlayersMap(map: OurKonvaMap): void {
        // map.toPlayers = !map.toPlayers;
        this.toPlayersMapEvent.emit(map);
    }

    toggleOpenOption(n: number, e): void {
        e.stopPropagation();
        this.openOption === n ? this.openOption = null : this.openOption = n;
    }

}
