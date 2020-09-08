import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MouseService} from '../../services/mouse.service';
import {Subscription} from 'rxjs';
import {Pointer} from '../../classes/Pointer';
import {Brush} from '../../classes/Brush';
import {Text} from '../../classes/Text';
import {Hand} from '../../classes/Hand';
import {MapObject} from '../../classes/MapObject';

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
                this.mouseService.setMouse(new Pointer());
                break;
            case 'hand':
                this.mouseService.setMouse(new Hand());
                break;
            case 'text':
                this.mouseService.setMouse(new Text());
                break;
            case 'brush':
                this.mouseService.setMouse(new Brush());
                break;
            case 'square':
                this.mouseService.setMouse(new MapObject());
                break;
            default:
                this.mouseService.setMouse(new Pointer());
                break;
        }
    }

}
