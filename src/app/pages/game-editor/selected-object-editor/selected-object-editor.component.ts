import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import {CurrentSelectedKonvaObject} from '../../../classes/ourKonva/OurKonvaMouse';
import {OurKonvaRect} from '../../../classes/ourKonva/OurKonvaRect';
import { Coords } from 'src/app/classes/Coords';

@Component({
    selector: 'app-selected-object-editor',
    templateUrl: './selected-object-editor.component.html',
    styleUrls: ['./selected-object-editor.component.scss']
})
export class SelectedObjectEditorComponent implements OnInit {
    @Input() selectedObject: CurrentSelectedKonvaObject;
    @Input() position: Coords;

    constructor() {}

    ngOnInit(): void {
    }

}
