import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {document} from 'ngx-bootstrap/utils';

@Component({
    selector: 'app-blueprints-interface',
    templateUrl: './blueprints-interface.component.html',
    styleUrls: ['./blueprints-interface.component.scss']
})
export class BlueprintsInterfaceComponent implements OnInit {
    @Output() closeBlueprints: EventEmitter<boolean> = new EventEmitter<boolean>();

    task: any = 5;
    user: any;

    constructor() { }

    ngOnInit(): void {
    }

    openDetail(kio: any): void {
        console.log(kio);
    }

    assignTask(task: any, user: any): void {
        console.log("This is our dragged task model: ");
        console.log(task);

        console.log("This is our user: ");
        console.log(user);
    }


}
