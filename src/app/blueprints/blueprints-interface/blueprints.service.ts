import { Injectable } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {BlueprintLink} from '../models/blueprint-link';
import {BBArea} from '../models/blueprint-boxes';
import {BlueprintModel} from '../models/base-blueprint';

@Injectable({
    providedIn: 'root'
})
export class BlueprintsService {
    blueprint = new BlueprintModel();

    constructor(private httpService: HttpService) {}

    // getBlueprintData(): BlueprintModel {
    // }
}
