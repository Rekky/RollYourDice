import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {OurKonvaMap} from '../../../classes/ourKonva/OurKonvaMap';

@Component({
    selector: 'app-map-properties',
    templateUrl: './map-properties.component.html',
    styleUrls: ['./map-properties.component.scss']
})
export class MapPropertiesComponent implements OnInit {

    @Input() map: OurKonvaMap;
    @Output() mapChange: EventEmitter<OurKonvaMap> = new EventEmitter<OurKonvaMap>();

    mapForm: UntypedFormGroup;
    imgURL: any = null;
    imagePath: string = null;
    errorMessage: string = null;

    constructor() { }

    ngOnInit(): void {
        this.mapForm = new UntypedFormGroup({
            width: new UntypedFormControl(this.map.nColumns),
            height: new UntypedFormControl(this.map.nRows),
            cellWidth: new UntypedFormControl(this.map.grid.cellSize)
        });
    }

    setBackgroundImage(): void {
        const background = new Image();
        background.src = 'https://triumvene.com/content/images/2019/08/f54890248-1-.jpg';
        // this.ourKonva.background = background.src;
    }

    preview(files): void {
        if (files.length === 0) {
            return;
        }

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.errorMessage = 'Only images are supported.';
            return;
        }

        const reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            this.imgURL = reader.result;
        };
    }

    save(): void {
        // this.ourKonva.width = this.mapForm.get('width').value;
        // this.ourKonva.height = this.mapForm.get('height').value;
        this.map.grid.cellSize = this.mapForm.get('cellWidth').value;
        this.mapChange.emit(this.map);
    }

}
