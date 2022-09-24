import { Injectable } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {BlueprintLink} from '../models/blueprint-link';
import {BBArea} from '../models/bb-area';
import {BlueprintModel} from '../models/base-blueprint';

@Injectable({
    providedIn: 'root'
})
export class BlueprintsService {
    blueprint = new BlueprintModel();

    constructor(private httpService: HttpService) {}

    getBlueprintData(): BlueprintModel {
        this.blueprint.blueprintBoxes.push(new BBArea());
        this.blueprint.blueprintBoxes.push(new BBArea());
        this.blueprint.blueprintBoxes[0].id = 'first';
        this.blueprint.blueprintBoxes[1].id = 'second';
        this.blueprint.blueprintBoxes[0].position.x = 600;
        this.blueprint.blueprintBoxes[0].position.y = 400;
        this.blueprint.blueprintBoxes[1].position.x = 1600;
        this.blueprint.blueprintBoxes[1].position.y = 800;

        this.blueprint.blueprintLinks.push(new BlueprintLink());
        this.blueprint.blueprintLinks[0].id = 'onlyOne';
        this.blueprint.blueprintLinks[0].startingNode.id = 'first';
        this.blueprint.blueprintLinks[0].endingNode.id = 'second';
        this.blueprint.blueprintLinks[0].position.x = 950;
        this.blueprint.blueprintLinks[0].position.y = 430;
        this.blueprint.blueprintLinks[0].startingNode.position.x = 0;
        this.blueprint.blueprintLinks[0].startingNode.position.y = 10;
        this.blueprint.blueprintLinks[0].endingNode.position.x = 650;
        this.blueprint.blueprintLinks[0].endingNode.position.y = 410;
        return this.blueprint;
    }
}
