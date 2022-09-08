import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

    @Input() tutorial: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    handleAction(ev: any): void {
        ev.preventDefault();
        ev.stopPropagation();
    }

}
