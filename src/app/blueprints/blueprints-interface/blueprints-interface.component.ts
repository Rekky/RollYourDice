import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Coords } from 'src/app/classes/Coords';
import {Actor, BBArea, BlueprintBox} from '../../classes/Actor';

@Component({
    selector: 'app-blueprints-interface',
    templateUrl: './blueprints-interface.component.html',
    styleUrls: ['./blueprints-interface.component.scss']
})
export class BlueprintsInterfaceComponent implements OnInit {
    @Output() closeBlueprints: EventEmitter<boolean> = new EventEmitter<boolean>();

    objects: Actor[] = [new Actor()];
    user: any;

    constructor() { }

    ngOnInit(): void {
        this.objects[0].blueprint.blueprintBoxes.push(new BBArea());
        this.objects[0].blueprint.blueprintBoxes.push(new BBArea());

        this.objects[0].blueprint.blueprintBoxes[0].position.x = 800;
        this.objects[0].blueprint.blueprintBoxes[0].position.y = 200;
        this.objects[0].blueprint.blueprintBoxes[1].position.x = 1200;
        this.objects[0].blueprint.blueprintBoxes[1].position.y = 200;
        this.objects[0].blueprint.blueprintBoxes[0].id = 'first';
        this.objects[0].blueprint.blueprintBoxes[1].id = 'second';
        this.objects[0].blueprint.blueprintBoxes[1].name = 'Area box (1)';
    }

    openDetail(kio: any): void {
        console.log(kio);
    }

    assignTask(object: any): void {
        const bb = this.objects[0].blueprint.blueprintBoxes.find(bbox => bbox.id === object.id);
        bb.position.y = bb.position.y + object.y;
        bb.position.x = bb.position.x + object.x;
    }

}
