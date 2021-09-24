import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {UserInteractor} from '../interactors/UserInteractor';
import {Asset} from '../classes/Asset';
import {LibrarySections} from '../pages/game-editor/editor-libraries/editor-libraries.component';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {

    constructor(private httpService: HttpService,
                private userInteractor: UserInteractor) {}


    async getLibrarySection(section: LibrarySections): Promise<any[]> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/library/${section}`, options).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }


    async deleteLibraryAsset(id: string): Promise<any[]> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.delete(`/library/assets/${id}`, options).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
