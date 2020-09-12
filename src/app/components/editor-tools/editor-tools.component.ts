import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MouseService} from '../../services/mouse.service';
import {Subscription} from 'rxjs';
import {OurKonvaPointer} from '../../classes/ourKonva/OurKonvaPointer';
import {OurKonvaHand} from '../../classes/ourKonva/OurKonvaHand';
import {OurKonvaBrush} from '../../classes/ourKonva/OurKonvaBrush';
import {OurKonvaText} from '../../classes/ourKonva/OurKonvaText';
import {OurKonvaObject} from '../../classes/ourKonva/OurKonvaObject';

@Component({
    selector: 'app-editor-tools',
    templateUrl: './editor-tools.component.html',
    styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit, OnDestroy {
    currentToolSelected: string = 'pointer';
    getMouseObservableSubscription: Subscription;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
                console.log(res);
                this.currentToolSelected = res.state;
            }
        });
        this.onToolSelected('pointer');
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    onToolSelected(type: string): void {
        this.currentToolSelected = type;
        switch (type) {
            case 'pointer':
                this.mouseService.setMouse(new OurKonvaPointer());
                break;
            case 'hand':
                this.mouseService.setMouse(new OurKonvaHand());
                break;
            case 'text':
                this.mouseService.setMouse(new OurKonvaText());
                break;
            case 'brush':
                this.mouseService.setMouse(new OurKonvaBrush());
                break;
            case 'square':
                this.mouseService.setMouse(new OurKonvaObject());
                break;
            default:
                this.mouseService.setMouse(new OurKonvaPointer());
                break;
        }
    }

}
