import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Asset, AssetType} from '../../../classes/Asset';
import {AssetService} from '../../../services/asset.service';

@Component({
    selector: 'app-assets-list-tools',
    templateUrl: './assets-list-tools.component.html',
    styleUrls: ['./assets-list-tools.component.scss']
})
export class AssetsListToolsComponent {

    @Input() assets: Asset[] = [];
    @Output() assetsChange: EventEmitter<any> = new EventEmitter();
    @Input() selectedAssets: Asset[] = [];
    @Output() selectedAssetsChange: EventEmitter<any> = new EventEmitter();

    openModal: boolean = false;
    openItemOption: number | null = null;
    formAsset: FormGroup;
    AssetType = AssetType;
    previewUploadFile: any;

    constructor(protected assetService: AssetService) {
        this.formAsset = new FormGroup({
            type: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            file: new FormControl(null, [Validators.required]),
            fileSource: new FormControl(null, [Validators.required])
        });

        this.getAllAssets();
    }

    async getAllAssets(): Promise<void> {
        try {
            this.assets = await this.assetService.getAllAssets();
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

    toggleItemOption(object: any, option: number, e?): void {
        e?.stopPropagation();
        if (this.openItemOption === option) {
            this.openItemOption = null;
        }
        else {
            this.openItemOption = option;
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
                this.formAsset.get('type').patchValue(this.getFileType(file));
            };
        }
    }

    getFileType(file: any): any {
        return file.type.split('/')[0];
    }
}
