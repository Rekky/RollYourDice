import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {MouseInteractor} from '../../../../interactors/MouseInteractor';
import {CurrentSelectedKonvaObject, OurKonvaObject} from '../../../../classes/ourKonva/OurKonvaObject';
import { Coords } from 'src/app/classes/Coords';

@Component({
    selector: 'app-selected-object-editor',
    templateUrl: './selected-object-editor.component.html',
    styleUrls: ['./selected-object-editor.component.scss']
})
export class SelectedObjectEditorComponent implements OnInit {
    @Input() selectedObject: CurrentSelectedKonvaObject;
    @Input() position: Coords;

    constructor(private mouseInteractor: MouseInteractor) {}

    ngOnInit(): void {}

    updateObject(ev: any): void {
        this.selectedObject.konvaObject.setAttrs(ev);
        this.selectedObject.layer.batchDraw();
        this.mouseInteractor.updateSelectedObject([this.selectedObject]);
        this.mouseInteractor.updateObject(ev);
    }

    isObjectAdaptedToGridToggle(ev: any): void {
        this.selectedObject.ourKonvaObject.isAdaptedToGrid = ev;
        if (ev) {
            this.selectedObject = this.mouseInteractor.adaptObjectToMap(this.selectedObject);
        }
        this.mouseInteractor.updateSelectedObject([this.selectedObject]);
        this.mouseInteractor.updateObject(this.selectedObject.ourKonvaObject);
    }

    editionBlockedToggle(ev: any): void {
        this.selectedObject.ourKonvaObject.isEditionBlocked = ev;
        if (ev) {
            this.selectedObject.konvaObject.draggable(false);
            this.selectedObject.transformer.hide();
        } else {
            this.selectedObject.konvaObject.draggable(true);
            this.selectedObject.transformer.show();
        }
        this.selectedObject.layer.batchDraw();
        this.mouseInteractor.updateSelectedObject([this.selectedObject]);
        this.mouseInteractor.updateObject(this.selectedObject.ourKonvaObject);
    }

    displayedJustForMaster(ev: any): void {
    }

}
