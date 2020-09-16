import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    API_URL: string = environment.api_socket;

    constructor() { }

    getGameEditor(id: string): any {
        return null;
    }

    setMapPosition(request: any): any {
        return null;
    }

}
