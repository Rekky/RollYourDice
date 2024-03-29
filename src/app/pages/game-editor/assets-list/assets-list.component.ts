import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AssetModel} from '../../../classes/AssetModel';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import {AssetInteractor} from '../../../interactors/AssetInteractor';
import {OurKonvaImage} from '../../../classes/ourKonva/OurKonvaImage';
import {ulid} from 'ulid';

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
    fgAsset: UntypedFormGroup;
    loading: boolean = false;

    constructor(protected assetInteractor: AssetInteractor,
                private mouseInteractor: MouseInteractor) {
        this.fgAsset = new UntypedFormGroup({
            name: new UntypedFormControl(null, [Validators.required, Validators.maxLength(100)]),
            files: new UntypedFormControl(null, [Validators.required]),
        });

        // modified name of file before upload
        this.fgAsset.valueChanges.subscribe((formValues: {name: string, files: any}) => {
            if (formValues.name) {
                const oldFile = formValues.files.get('file');
                formValues.files.set('file', oldFile, formValues.name);
            }
        });

        this.getAllAssets();
    }

    async getAllAssets(): Promise<void> {
        try {
            this.assets = await this.assetInteractor.getAllAssets();
            this.assets.sort((a: AssetModel, b: AssetModel) => a.createdAt > b.createdAt ? 1 : -1);
        } catch (e) {
            console.log(e);
        }
    }

    async removeItem(obj?: any, e?): Promise<void> {
        e.stopPropagation();
        this.assetInteractor.removeAsset(obj).then(() => {
            this.getAllAssets();
        });
    }

    async uploadAsset(): Promise<void> {
        const formData = this.fgAsset.value.files;
        try {
            this.loading = true;
            await this.assetInteractor.uploadFile(formData);
            await this.getAllAssets();
            this.openModal = false;
        } catch (e) {
            console.log('error', e);
        } finally {
            this.loading = false;
        }
    }

    onInputFilesChange(files: FormData): void {
        this.fgAsset.patchValue({files: files});
        files.forEach((file: any) => {
            this.fgAsset.patchValue({name: file.name});
        });
    }

    paintAssetOnMap(asset: AssetModel): any {
        const newAsset = {...new AssetModel(), ...asset};
        newAsset.id = ulid();
        this.mouseInteractor.addImageOnMap(newAsset);
    }

}
