import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MouseService} from '../../services/mouse.service';
import {Subscription, Observable, fromEvent} from 'rxjs';
import {OurKonvaPointer} from '../../classes/ourKonva/OurKonvaPointer';
import {OurKonvaHand} from '../../classes/ourKonva/OurKonvaHand';
import {OurKonvaBrush} from '../../classes/ourKonva/OurKonvaBrush';
import {OurKonvaText} from '../../classes/ourKonva/OurKonvaText';
import {OurKonvaEraser} from '../../classes/ourKonva/OurKonvaEraser';
import {OurKonvaRect} from '../../classes/ourKonva/OurKonvaRect';
import {OurKonvaImage} from '../../classes/ourKonva/OurKonvaImage';
import {MouseInteractor} from '../../interactors/MouseInteractor';

@Component({
    selector: 'app-editor-tools',
    templateUrl: './editor-tools.component.html',
    styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit, OnDestroy {
    displayExtraToolsIndex: number = 99;
    currentToolSelected: string = 'pointer';
    getMouseObservableSubscription: Subscription;

    blocksOfTools: any[][] = [
        [
            {name: 'pointer', displayed: true, icon: 'fas fa-mouse-pointer'}
        ],
        [
            {name: 'hand', displayed: true, icon: 'far fa-hand-paper'}
        ],
        [
            {name: 'text', displayed: true, icon: 'fas fa-text-width'}
        ],
        [
            {name: 'brush', displayed: true, icon: 'fas fa-paint-brush'},
            {name: 'eraser', displayed: false, icon: 'fas fa-eraser'}
        ],
        [
            {name: 'square', displayed: true, icon: 'far fa-square'}
        ],
        [
            {name: 'image', displayed: true, icon: 'far fa-image'}
        ]
    ];

    constructor(private mouseService: MouseService,
                private mouseInteractor: MouseInteractor) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
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

    onToolSelected(tool: string): void {
        // this.currentToolSelected = tool;
        this.displayExtraToolsIndex = 99;
        this.changeDisplayedTool(tool);
        if (tool !== 'pointer') {
            this.mouseInteractor.unsetSelectedKonvaObject();
        }
        switch (tool) {
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
            case 'eraser':
                this.mouseService.setMouse(new OurKonvaEraser());
                break;
            case 'square':
                this.mouseService.setMouse(new OurKonvaRect());
                break;
            case 'image':
                this.mouseService.setMouse(new OurKonvaImage('../../assets/backgrounds/volcano-island.jpg'));
                break;
            default:
                this.mouseService.setMouse(new OurKonvaPointer());
                break;
        }
    }

    changeDisplayedTool(tool: string): void {
        let toolPackIndex = 0;
        for (let i = 0; i < this.blocksOfTools.length; i++) {
            for (let j = 0; j < this.blocksOfTools[i].length; j++) {
                if (tool === this.blocksOfTools[i][j].name) {
                    toolPackIndex = i;
                }
            }
        }
        this.blocksOfTools[toolPackIndex].map(mapTool => {
            mapTool.displayed = mapTool.name === tool;
        });
    }
}
