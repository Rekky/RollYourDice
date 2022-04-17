import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MouseInteractor} from '../../../../interactors/MouseInteractor';
import {CurrentSelectedKonvaObject, OurKonvaMouse} from '../../../../classes/ourKonva/OurKonvaMouse';
import {OurKonvaRect} from '../../../../classes/ourKonva/OurKonvaRect';
import { Coords } from 'src/app/classes/Coords';
import {OurKonvaText} from '../../../../classes/ourKonva/OurKonvaText';
import Konva from 'konva';
import {OurKonvaImage} from '../../../../classes/ourKonva/OurKonvaImage';

@Component({
    selector: 'app-selected-object-editor',
    templateUrl: './selected-object-editor.component.html',
    styleUrls: ['./selected-object-editor.component.scss']
})
export class SelectedObjectEditorComponent implements OnInit {
    @Input() selectedObject: CurrentSelectedKonvaObject;
    @Input() position: Coords;

    ourSelectedObject: OurKonvaRect | OurKonvaText | OurKonvaImage;

    constructor(private mouseInteractor: MouseInteractor) {}

    ngOnInit(): void {
        if (this.selectedObject.type === 'square') {
            this.ourSelectedObject = OurKonvaRect.getOurKonvaRect(this.selectedObject.konvaObject as Konva.Rect);
        }
    }

    updateObject(ev: any): void {
        if (this.selectedObject.type === 'square') {
            this.selectedObject.konvaObject.setAttrs(ev);
            this.selectedObject.layer.batchDraw();
        }
        this.mouseInteractor.updateSelectedObject(this.selectedObject);
        this.mouseInteractor.updateObject(ev);
    }

}
