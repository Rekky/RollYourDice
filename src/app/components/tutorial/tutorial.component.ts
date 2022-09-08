import {Component, Input, OnInit} from '@angular/core';
import {Tutorial} from '../../classes/Tutorial';

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

    @Input() tutorial: Tutorial = {
        id: '12312',
        name: 'name 1',
        active: false,
        steps: [
            {
                order: 0,
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
                area: {x: 0, y: 280, width: 70, height: 280},
                complete: false,
                title: ''
            }
        ]
    };

    constructor() {
    }

    ngOnInit(): void {
    }

    handleAction(ev: any): void {
        ev.preventDefault();
        ev.stopPropagation();
    }

}
