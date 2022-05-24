import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Asset} from '../classes/Asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

    constructor(private httpService: HttpService) {}


    async uploadFile(formData: FormData): Promise<Asset> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/assets/upload`, formData).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    async getAllAssets(): Promise<Asset[]> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/assets/getAll`, {}).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}

