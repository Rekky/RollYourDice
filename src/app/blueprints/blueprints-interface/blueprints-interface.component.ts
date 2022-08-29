import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Coords } from 'src/app/classes/Coords';
import {Actor} from '../../classes/Actor';

@Component({
    selector: 'app-blueprints-interface',
    templateUrl: './blueprints-interface.component.html',
    styleUrls: ['./blueprints-interface.component.scss']
})
export class BlueprintsInterfaceComponent implements OnInit {
    @Output() closeBlueprints: EventEmitter<boolean> = new EventEmitter<boolean>();

    theObject: Actor = new Actor();
    user: any;

    constructor() { }

    ngOnInit(): void {
    }

    openDetail(kio: any): void {
        console.log(kio);
    }

    assignTask(object: any): void {
        this.theObject.blueprint.position.y = this.theObject.blueprint.position.y + object.y;
        this.theObject.blueprint.position.x = this.theObject.blueprint.position.x + object.x;
    }

}
