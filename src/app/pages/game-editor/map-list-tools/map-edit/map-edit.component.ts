import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OurKonvaMap} from '../../../../classes/ourKonva/OurKonvaMap';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../../../classes/Game';
import {AssetService} from '../../../../services/asset.service';

@Component({
    selector: 'app-map-edit',
    templateUrl: './map-edit.component.html',
    styleUrls: ['./map-edit.component.scss']
})
export class MapEditComponent implements OnInit {
    mapForm: FormGroup;
    loaded: boolean = false;
    assetFormData: FormData = null;

    constructor(
        private dialogRef: MatDialogRef<Game>,
        private ngZone: NgZone,
        private assetService: AssetService,
        @Inject(MAT_DIALOG_DATA) public data: MapEditDialogOptions
    ) { }

    ngOnInit(): void {
        this.mapForm = new FormGroup({
            name: new FormControl(this.data.map.name, Validators.required),
            nRows: new FormControl(this.data.map.nRows, Validators.required),
            nColumns: new FormControl(this.data.map.nColumns, Validators.required),
            isFogOfWar: new FormControl(this.data.map.isFogOfWar),
            nFogOfPercent: new FormControl(this.data.map.nFogOfWarPercent),
            backgroundImage: new FormControl(this.data.map.backgroundImage)
        });
        setTimeout(() => {
            this.loaded = true;
        }, 500);
    }

    submitMapForm(): void {
        this.uploadFiles();
        this.data.map.name = this.mapForm.get('name').value;
        this.data.map.nRows = this.mapForm.get('nRows').value;
        this.data.map.nColumns = this.mapForm.get('nColumns').value;
        this.data.map.isFogOfWar = this.mapForm.get('isFogOfWar').value;
        this.data.map.nFogOfWarPercent = this.mapForm.get('nFogOfPercent').value;
        this.dialogRef.close({map: this.data.map});
    }

    filesChanged(formData: FormData): void {
        console.log('filesChanged', formData);
        // formData.append('mapId', this.data.map.id.toString());
        this.assetFormData = formData;
    }

    async uploadFiles(): Promise<void>  {
        await this.assetService.uploadFile(this.assetFormData);
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
