import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AssetType} from '../../../classes/Asset';

@Component({
    selector: 'app-assets-list-tools',
    templateUrl: './assets-list-tools.component.html',
    styleUrls: ['./assets-list-tools.component.scss']
})
export class AssetsListToolsComponent {

    @Input() assets: any = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100];
    @Output() assetsChange: EventEmitter<any> = new EventEmitter();
    @Input() selectedAssets: any = [];
    @Output() selectedAssetsChange: EventEmitter<any> = new EventEmitter();

    openModal: boolean = false;
    formAsset: FormGroup;
    AssetType = AssetType;
    previewUploadFile: any;

    constructor() {
        this.formAsset = new FormGroup({
            type: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            file: new FormControl(null, [Validators.required])
        });
    }

    uploadAsset(): void {
        console.log('uploadAsset', this.toFormData(this.formAsset.value));
    }

    toFormData<T>( formValue: T ): FormData {
        const formData = new FormData();

        for ( const key of Object.keys(formValue) ) {
            const value = formValue[key];
            formData.append(key, value);
        }

        return formData;
    }

    async onFileChange(ev: any): Promise<void> {
        const reader = new FileReader();
        if (ev.target.files && ev.target.files.length) {
            const [file] = ev.target.files;
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.previewUploadFile = reader.result as string;

                // set fileName and type
                this.formAsset.get('name').patchValue(file.name);
                this.formAsset.get('type').patchValue(this.getFileType(file));
            };
        }
    }

    getFileType(file: any): any {
        return file.type.split('/')[0];
    }
}
