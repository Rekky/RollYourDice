import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {OurKonvaRect} from '../../../../../classes/ourKonva/OurKonvaRect';

@Component({
  selector: 'app-konva-rectangle-properties',
  templateUrl: './konva-rectangle-properties.component.html',
  styleUrls: ['./konva-rectangle-properties.component.scss']
})
export class KonvaRectanglePropertiesComponent implements OnInit, OnDestroy {
    @Input() rectangle: OurKonvaRect;
    @Output() rectangleChange: EventEmitter<OurKonvaRect> = new EventEmitter<OurKonvaRect>();

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

    strokeColorModified(ev: string): void {
        this.rectangle.stroke = ev;
        this.rectangleChange.emit(this.rectangle);
    }
}