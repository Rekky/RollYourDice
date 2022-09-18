import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {UserInteractor} from "../interactors/UserInteractor";
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MapObjectService {

    protected endPointName: string = 'maps';

    constructor(private httpService: HttpService,
                private userInteractor: UserInteractor) {
    }

    createMapObject(mapId: string, object: any): Promise<any> {
        const body = {
            mapId: mapId,
            object: object
        };

        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}/object`, body).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
