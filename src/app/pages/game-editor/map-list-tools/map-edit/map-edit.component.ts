import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { OurKonvaMap } from '../../../../classes/ourKonva/OurKonvaMap';
import { AssetService } from '../../../../services/asset.service';
import { AssetModel } from '../../../../classes/AssetModel';
import {StrokeOptions} from '../../context-menu/custom-inputs/stroke-input/stroke-input.component';

@Component({
    selector: 'app-map-edit',
    templateUrl: './map-edit.component.html',
    styleUrls: ['./map-edit.component.scss']
})
export class MapEditComponent implements OnInit {
    @Input() map: OurKonvaMap;
    @Output() mapModification: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();

    mapForm: UntypedFormGroup;
    loaded: boolean = false;
    assetFormData: FormData = null;

    constructor(
        private ngZone: NgZone,
        private assetService: AssetService
    ) { }

    ngOnInit(): void {}

    submitMap(): void {
        this.mapModification.emit(this.map);
    }

    filesChanged(formData: FormData): void {
        this.assetFormData = formData;
    }

    nRowsModified(rows: number): void {
        this.map.nRows = rows;
        this.mapModification.emit(this.map);
    }

    nColumnsModified(columns: number): void {
        this.map.nColumns = columns;
        this.mapModification.emit(this.map);
    }

    cellSizeModified(size: number): void {
        this.map.grid.cellSize = size;
        this.mapModification.emit(this.map);
    }

    backgroundModified(color: string): void {
        this.map.backgroundColor = color;
        this.mapModification.emit(this.map);
    }

    strokeModified(ev: StrokeOptions): void {
        this.map.grid.stroke = ev.color;
        this.map.grid.strokeSize = ev.width;
        this.mapModification.emit(this.map);
    }
}

export interface MapEditDialogOptions {
    map: OurKonvaMap;
    title: string;
}
