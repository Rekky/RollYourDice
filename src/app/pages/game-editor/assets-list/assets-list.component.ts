import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AssetModel, AssetType} from '../../../classes/AssetModel';
import {AssetService} from '../../../services/asset.service';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import {OurKonvaImage} from '../../../classes/ourKonva/OurKonvaImage';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Player} from '../../../classes/User';
import {OurKonvaRect} from '../../../classes/ourKonva/OurKonvaRect';

@Component({
    selector: 'app-assets-list',
    templateUrl: './assets-list.component.html',
    styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent {
    @Input() assets: AssetModel[] = [];
    @Output() assetsChange: EventEmitter<any> = new EventEmitter();
    @Input() selectedAssets: AssetModel[] = [];
    @Output() selectedAssetsChange: EventEmitter<any> = new EventEmitter();

    openModal: boolean = false;
    formAsset: FormGroup;
    AssetType = AssetType;
    previewUploadFile: any;

    constructor(protected assetService: AssetService,
                private mouseInteractor: MouseInteractor) {
        this.formAsset = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            file: new FormControl(null, [Validators.required]),
            fileSource: new FormControl(null, [Validators.required])
        });

        this.getAllAssets();
    }

    async getAllAssets(): Promise<void> {
        try {
            this.assets = await this.assetService.getAllAssets();
            this.assets.sort((a: AssetModel, b: AssetModel) => a.createdAt > b.createdAt ? 1 : -1);
        } catch (e) {
            console.log(e);
        }
    }

    async uploadAsset(): Promise<void> {
        const formData = this.toFormData(this.formAsset.value);
        try {
            await this.assetService.uploadFile(formData);
            await this.getAllAssets();
            this.openModal = false;
        } catch (e) {
            console.log('error', e);
        }
    }

    async removeItem(obj?: any, e?): Promise<void> {
        e.stopPropagation();
        this.assetService.removeAsset(obj).then(() => {
            this.getAllAssets();
        });
    }

    toFormData<T>( formValue: T ): any {
        const formData = new FormData();

        for ( const key of Object.keys(formValue) ) {
            const value = formValue[key];
            if (key !== 'file' && key !== 'fileSource') {
                formData.append(key, value);
            }
        }
        formData.append('file', this.formAsset.get('fileSource').value);
        return formData;
    }

    onFileChange(ev: any): void {
        const reader = new FileReader();
        if (ev.target.files && ev.target.files.length) {
            const [file] = ev.target.files;
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.previewUploadFile = reader.result as string;
                this.formAsset.patchValue({fileSource: file});

                // set fileName and type
                this.formAsset.get('name').patchValue(file.name);
            };
        }
    }

    getFileType(file: any): any {
        return file.type.split('/')[0];
    }

    paintAssetOnMap(asset: AssetModel): any {
        this.mouseInteractor.addImageOnMap(asset);
    }
}
