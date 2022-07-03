import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MouseService} from '../../../../../services/mouse.service';
import {OurKonvaText} from '../../../../../classes/ourKonva/OurKonvaText';
import {CurrentSelectedKonvaObject} from '../../../../../classes/ourKonva/OurKonvaMouse';
import {MouseInteractor} from '../../../../../interactors/MouseInteractor';
import {OurKonvaRect} from '../../../../../classes/ourKonva/OurKonvaRect';
import Konva from 'konva';
import {SocketService} from '../../../../../services/socket.service';

@Component({
    selector: 'app-konva-text-properties',
    templateUrl: './konva-text-properties.component.html',
    styleUrls: ['./konva-text-properties.component.scss']
})
export class KonvaTextPropertiesComponent implements OnInit, OnDestroy {
    text: OurKonvaText;
    getMouseObservableSubscription: Subscription;
    getSelectedKonvaObjectSubscription: Subscription;
    konvaText: CurrentSelectedKonvaObject[];

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.getSelectedKonvaObjectSubscription) {
            this.getSelectedKonvaObjectSubscription.unsubscribe();
        }
    }

    colorModified(ev: string): void {
    }

    sizeModified(ev: number): void {
    }
}
