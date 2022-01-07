import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MouseService} from '../../../../services/mouse.service';
import {OurKonvaText} from '../../../../classes/ourKonva/OurKonvaText';
import {CurrentSelectedKonvaObject} from '../../../../classes/ourKonva/OurKonvaMouse';
import {MouseInteractor} from '../../../../interactors/MouseInteractor';
import {OurKonvaRect} from '../../../../classes/ourKonva/OurKonvaRect';
import Konva from 'konva';
import {SocketService} from '../../../../services/socket.service';

@Component({
    selector: 'app-konva-text-properties',
    templateUrl: './konva-text-properties.component.html',
    styleUrls: ['./konva-text-properties.component.scss']
})
export class KonvaTextPropertiesComponent implements OnInit, OnDestroy {
    text: OurKonvaText;
    getMouseObservableSubscription: Subscription;
    getSelectedKonvaObjectSubscription: Subscription;
    konvaText: CurrentSelectedKonvaObject;

    constructor(private mouseService: MouseService,
                private mouseInteractor: MouseInteractor,
                private socketService: SocketService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.text = mouse;
        });
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe((konva) => {
            if (konva && konva.type === 'text') {
                this.konvaText = konva;
                const konvaAttrs = konva.konvaObject.getAttrs();
                this.text.color = konvaAttrs.fill;
                this.text.fontSize = konvaAttrs.fontSize;
            }
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.getSelectedKonvaObjectSubscription) {
            this.getSelectedKonvaObjectSubscription.unsubscribe();
        }
    }

    colorModified(ev: string): void {
        this.text.color = ev;
        this.mouseService.setMouse(this.text);
        if (this.konvaText) {
            this.konvaText.konvaObject.setAttr('fill', ev);
            this.konvaText.layer.batchDraw();
            const ourKonvaRect = OurKonvaRect.getOurKonvaRect(this.konvaText.konvaObject as Konva.Rect);
            this.socketService.sendGameEditMapObject(ourKonvaRect);
        }
    }

    sizeModified(ev: number): void {
        this.text.fontSize = ev;
        this.mouseService.setMouse(this.text);
        if (this.konvaText) {
            this.konvaText.konvaObject.setAttr('fontSize', ev);
            this.konvaText.layer.batchDraw();
            const ourKonvaRect = OurKonvaRect.getOurKonvaRect(this.konvaText.konvaObject as Konva.Rect);
            this.socketService.sendGameEditMapObject(ourKonvaRect);
        }
    }
}
