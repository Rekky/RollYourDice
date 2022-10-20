import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OurKonvaRect} from '../../../../../classes/ourKonva/OurKonvaRect';
import {MoreOptionsModel} from '../../custom-inputs/more-options/more-options.component';
import {StrokeOptions} from '../../custom-inputs/stroke-input/stroke-input.component';
import {OurKonvaActor} from '../../../../../classes/ourKonva/OurKonvaActor';

@Component({
  selector: 'app-konva-actor-properties',
  templateUrl: './konva-actor-properties.component.html',
  styleUrls: ['./konva-actor-properties.component.scss']
})
export class KonvaActorPropertiesComponent implements OnInit {
    @Input() actor: OurKonvaActor;
    @Output() actorChange: EventEmitter<OurKonvaRect> = new EventEmitter<OurKonvaRect>();
    @Output() isAdaptedToGridChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isEditionBlockedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isDisplayedJustForMasterChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    moreOptionsSettings: MoreOptionsModel;

    constructor() { }

    ngOnInit(): void {
        this.moreOptionsSettings = MoreOptionsModel.fromJSON({
            setAsBackgroundImage: { isDisplayed: false },
            blueprint: { isDisplayed: true, actor: this.actor }
        });
    }

    isAdaptedToGrid(ev: boolean): void {
        this.actor.isAdaptedToGrid = ev;
        this.isAdaptedToGridChange.emit(ev);
    }

    isDisplayedJustForMaster(ev: boolean): void {
        this.isDisplayedJustForMasterChange.emit(ev);
    }

    isObjectEditionBlocked(ev: boolean): void {
        this.actor.isEditionBlocked = ev;
        this.isEditionBlockedChange.emit(ev);
    }

}
