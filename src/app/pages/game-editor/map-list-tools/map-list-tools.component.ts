import {Component, EventEmitter, Input, OnInit, Output, OnDestroy, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {OurKonvaMap} from '../../../classes/ourKonva/OurKonvaMap';
import {Subscription} from 'rxjs';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import { MapEditComponent } from './map-edit/map-edit.component';
import {MatDialog} from '@angular/material/dialog';
import {Camera} from '../../../classes/Camera';
import {CurrentSelectedKonvaObject} from '../../../classes/ourKonva/OurKonvaMouse';

@Component({
    selector: 'app-map-list-tools',
    templateUrl: './map-list-tools.component.html',
    styleUrls: ['./map-list-tools.component.scss']
})
export class MapListToolsComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    @Input() maps: OurKonvaMap[] = [];
    @Input() selectedMap: OurKonvaMap = null;
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
    isEditNameDisplayed: string = null;

    getSelectedKonvaObjectSubscription: Subscription;

    constructor(private mouseInteractor: MouseInteractor, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe((selectedObject: CurrentSelectedKonvaObject[] | null) => {
            this.maps?.find(map => {
                // const objectToSelect = map.objects.find(object => {
                //     return object?.id === selectedObject?.konvaObject.getAttr('id');
                //     selectedObject?.forEach(object => {
                //         object?.id === object?.konvaObject.getAttr('id');
                //     });
                // });
            });
        });
        this.updateMapForm = this.newMapForm;
    }

    ngAfterViewInit(): void {
        this.scrollToBottom();
    }

    ngOnDestroy(): void {
        this.getSelectedKonvaObjectSubscription?.unsubscribe();
    }

    // MAPS ===========================================================================================================
    onSelectMap(map: OurKonvaMap, ev?): void {
        ev?.stopPropagation();
        if (this.selectedMap.id !== map.id) {
            this.selectedMap = map;
            this.selectedMapEvent.emit(this.selectedMap);
        }
    }

    createMap(): void {
        const newMap = new OurKonvaMap();
        this.maps.push(newMap);
        this.createMapEvent.emit(newMap);

        this.selectedMap = newMap;
        this.selectedMapEvent.emit(this.selectedMap);
        this.scrollToBottom();
    }

    editMap(map: OurKonvaMap): void {
        this.updateMapEvent.emit(map);
        this.selectedMap = map;
        this.selectedMapEvent.emit(this.selectedMap);
    }

    deleteMap(map: OurKonvaMap, e?): void {
        e?.stopPropagation();
        this.openMapOption = null;
        this.maps.splice(this.maps.indexOf(map), 1);

        this.selectedMap = this.maps[this.maps.length - 1] ?? null;
        this.deleteMapEvent.emit(map);
    }

    saveNewMapName(map: OurKonvaMap): void {
        this.editMap(map);
        this.isEditNameDisplayed = null;
    }

    onDragulaMapsChange(maps: any): void {
        this.maps = maps;
        this.mapsChange.emit(this.maps);
    }

    scrollToBottom(): void {
        try {
            console.log('scrollToBottom');
            setTimeout(() => {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 500);
        } catch (err) { }
    }

    // ==== OTHERS ==== //
    toPlayersMap(map: OurKonvaMap): void {
        // map.toPlayers = !map.toPlayers;
        this.toPlayersMapEvent.emit(map);
    }
}
