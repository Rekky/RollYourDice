import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Coords } from 'src/app/classes/Coords';

@Component({
    selector: 'app-coords-input',
    templateUrl: './coords-input.component.html',
    styleUrls: ['./coords-input.component.scss']
})
export class CoordsInputComponent implements OnInit {
    @Input() coords: Coords;
    @Output() coordsChange: EventEmitter<Coords> = new EventEmitter<Coords>();

    constructor() { }

    ngOnInit(): void {
    }

    positionModified(): void {
        this.coordsChange.emit();
    }

}
