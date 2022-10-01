import {Injectable} from '@angular/core';
import {AssetService} from '../services/asset.service';
import {AssetModel} from '../classes/AssetModel';


@Injectable({
    providedIn: 'root'
})
export class AssetInteractor {

    constructor(private assetService: AssetService) {
    }

    async uploadFile(formData: FormData): Promise<AssetModel[]> {
        return await this.assetService.uploadFile(formData);
    }

    async getAllAssets(): Promise<AssetModel[]> {
        return await this.assetService.getAllAssets();
    }

    async removeAsset(asset: AssetModel): Promise<AssetModel[]> {
        return await this.assetService.removeAsset(asset);
    }
}
