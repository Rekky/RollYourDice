import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import { Coords } from 'src/app/classes/Coords';
import {OurKonvaRect} from '../../../../../classes/ourKonva/OurKonvaRect';
import {StrokeOptions} from '../../custom-inputs/stroke-input/stroke-input.component';
import {OurKonvaObject} from '../../../../../classes/ourKonva/OurKonvaObject';
import {MoreOptionsModel} from '../../custom-inputs/more-options/more-options.component';

@Component({
  selector: 'app-konva-rectangle-properties',
  templateUrl: './konva-rectangle-properties.component.html',
  styleUrls: ['./konva-rectangle-properties.component.scss']
})
export class KonvaRectanglePropertiesComponent implements OnInit {
    @Input() rectangle: OurKonvaRect;
    @Output() rectangleChange: EventEmitter<OurKonvaRect> = new EventEmitter<OurKonvaRect>();
    @Output() isAdaptedToGridChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isEditionBlockedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isDisplayedJustForMasterChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    moreOptionsSettings: MoreOptionsModel;

    constructor() { }

    ngOnInit(): void {
        this.moreOptionsSettings = MoreOptionsModel.fromJSON({
            setAsBackgroundImage: { isDisplayed: false}
        });
    }

    fillColorModified(ev: string): void {
        this.rectangle.fill = ev;
        this.rectangleChange.emit(this.rectangle);
    }

    strokeModified(ev: StrokeOptions): void {
        this.rectangle.stroke = ev.color;
        this.rectangle.strokeWidth = ev.width;
        this.rectangleChange.emit(this.rectangle);
    }

    isAdaptedToGrid(ev: boolean): void {
        this.rectangle.isAdaptedToGrid = ev;
        this.isAdaptedToGridChange.emit(ev);
    }

    isDisplayedJustForMaster(ev: boolean): void {
        this.isDisplayedJustForMasterChange.emit(ev);
    }

    isObjectEditionBlocked(ev: boolean): void {
        this.rectangle.isEditionBlocked = ev;
        this.isEditionBlockedChange.emit(ev);
    }

}
