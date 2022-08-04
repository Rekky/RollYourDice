import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-blueprints-interface',
    templateUrl: './blueprints-interface.component.html',
    styleUrls: ['./blueprints-interface.component.scss']
})
export class BlueprintsInterfaceComponent implements OnInit {
    @Output() closeBlueprints: EventEmitter<boolean> = new EventEmitter<boolean>();

    theObject: any = {
        x: 0,
        y: 0,
        id: 'object-id'
    };
    user: any;

    constructor() { }

    ngOnInit(): void {
    }

    openDetail(kio: any): void {
        console.log(kio);
    }

    assignTask(object: any): void {
        this.theObject.y = this.theObject.y + object.y;
        this.theObject.x = this.theObject.x + object.x;
    }

}
