import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import { Coords } from 'src/app/classes/Coords';
import {OurKonvaRect} from '../../../../../classes/ourKonva/OurKonvaRect';
import {StrokeOptions} from '../../custom-inputs/stroke-input/stroke-input.component';
import {OurKonvaMouse} from '../../../../../classes/ourKonva/OurKonvaMouse';

@Component({
  selector: 'app-konva-rectangle-properties',
  templateUrl: './konva-rectangle-properties.component.html',
  styleUrls: ['./konva-rectangle-properties.component.scss']
})
export class KonvaRectanglePropertiesComponent implements OnInit, OnDestroy {
    @Input() rectangle: OurKonvaRect;
    @Output() rectangleChange: EventEmitter<OurKonvaRect> = new EventEmitter<OurKonvaRect>();
    @Output() isAdaptedToGridChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    getSelectedKonvaObjectSubscription: Subscription;

    tempValue: any;

    constructor() { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        if (this.getSelectedKonvaObjectSubscription) {
            this.getSelectedKonvaObjectSubscription.unsubscribe();
        }
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
        this.isAdaptedToGridChange.emit(ev);
    }

}
