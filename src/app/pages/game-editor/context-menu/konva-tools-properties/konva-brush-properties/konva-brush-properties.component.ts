import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {OurKonvaBrush} from '../../../../../classes/ourKonva/OurKonvaBrush';
import {StrokeOptions} from '../../custom-inputs/stroke-input/stroke-input.component';

@Component({
    selector: 'app-konva-brush-properties',
    templateUrl: './konva-brush-properties.component.html',
    styleUrls: ['./konva-brush-properties.component.scss']
})
export class KonvaBrushPropertiesComponent implements OnInit {
    @Input() brush: OurKonvaBrush;
    @Output() brushChange: EventEmitter<OurKonvaBrush> = new EventEmitter<OurKonvaBrush>();
    @Output() isEditionBlockedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
    }

    strokeModified(ev: StrokeOptions): void {
        this.brush.stroke = ev.color;
        this.brush.strokeWidth = ev.width;
        this.brushChange.emit(this.brush);
    }

    isObjectEditionBlocked(ev: boolean): void {
        this.brush.isEditionBlocked = ev;
        this.isEditionBlockedChange.emit(ev);
    }
}
