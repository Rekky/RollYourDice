import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {HttpService} from "./http.service";
import {UserInteractor} from "../interactors/UserInteractor";
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MapObjectService {

    constructor(private apiService: ApiService,
                private httpService: HttpService,
                private userInteractor: UserInteractor) {
    }

    createMapObject(mapId: string, object: any): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };

        const body = {
            mapId: mapId,
            object: object
        };

        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/map/object`, body, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
