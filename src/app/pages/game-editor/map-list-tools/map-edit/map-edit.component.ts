import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OurKonvaMap} from '../../../../classes/ourKonva/OurKonvaMap';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../../../classes/Game';

@Component({
    selector: 'app-map-edit',
    templateUrl: './map-edit.component.html',
    styleUrls: ['./map-edit.component.scss']
})
export class MapEditComponent implements OnInit {
    mapForm: FormGroup;
    loaded: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<Game>,
        private ngZone: NgZone,
        @Inject(MAT_DIALOG_DATA) public data: MapEditDialogOptions
    ) { }

    ngOnInit(): void {
        this.mapForm = new FormGroup({
            name: new FormControl(this.data.map.name, Validators.required),
            nRows: new FormControl(this.data.map.nRows, Validators.required),
            nColumns: new FormControl(this.data.map.nColumns, Validators.required)
        });
        setTimeout(() => {
            this.loaded = true;
        }, 500);
    }

    submitMapForm(): void {
        this.data.map.name = this.mapForm.get('name').value;
        this.data.map.nRows = this.mapForm.get('nRows').value;
        this.data.map.nColumns = this.mapForm.get('nColumns').value;

        this.dialogRef.close({map: this.data.map});
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }

}

export interface MapEditDialogOptions {
    map: OurKonvaMap;
    title: string;
}