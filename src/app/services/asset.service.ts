import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AssetModel} from '../classes/AssetModel';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

    protected endPointName: string = 'assets';

    constructor(private httpService: HttpService) {}


    async uploadFile(formData: any): Promise<AssetModel[]> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.postTest(`/${this.endPointName}/upload`, formData).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    async getAllAssets(): Promise<AssetModel[]> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}/my-assets`, {}).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    async removeAsset(asset: AssetModel): Promise<AssetModel[]> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.delete(`/${this.endPointName}/${asset.id}`).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}

