import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {UserInteractor} from '../interactors/UserInteractor';
import {Asset} from '../classes/Asset';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

    constructor(private httpService: HttpService) {}


    async uploadFile(data: any): Promise<Asset> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/assets/upload`, data).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}

