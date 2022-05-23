import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MouseService} from '../../../services/mouse.service';
import {Subscription, Observable, fromEvent} from 'rxjs';
import {OurKonvaPointer} from '../../../classes/ourKonva/OurKonvaPointer';
import {OurKonvaHand} from '../../../classes/ourKonva/OurKonvaHand';
import {OurKonvaBrush} from '../../../classes/ourKonva/OurKonvaBrush';
import {OurKonvaText} from '../../../classes/ourKonva/OurKonvaText';
import {OurKonvaEraser} from '../../../classes/ourKonva/OurKonvaEraser';
import {OurKonvaRect} from '../../../classes/ourKonva/OurKonvaRect';
import {OurKonvaImage} from '../../../classes/ourKonva/OurKonvaImage';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import {AssetService} from '../../../services/asset.service';
import {Asset} from '../../../classes/Asset';
import {UserInteractor} from '../../../interactors/UserInteractor';
import { Player } from 'src/app/classes/User';

@Component({
    selector: 'app-editor-tools',
    templateUrl: './editor-tools.component.html',
    styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit, OnDestroy {
    displayExtraToolsIndex: number = 99;
    currentToolSelected: string = 'pointer';
    getMouseObservableSubscription: Subscription;

    blocksOfTools: {name: string, displayed: boolean}[][] = [
        [
            {name: 'pointer', displayed: true}
        ],
        [
            // {name: 'hand', displayed: true}
        ],
        [
            {name: 'text', displayed: true}
        ],
        [
            {name: 'brush', displayed: true},
            // {name: 'eraser', displayed: false},
        ],
        [
            {name: 'square', displayed: true},
        ],
        [
            {name: 'image', displayed: true}
        ]
    ];

    author: Player = new Player();

    constructor(private mouseService: MouseService,
                private mouseInteractor: MouseInteractor,
                private imageService: AssetService,
                private userInteractor: UserInteractor,
                private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            if (res) {
                this.currentToolSelected = res.state;
            }
        });
        this.onToolSelected('pointer');
        this.author.fromUserToPlayer(this.userInteractor.getCurrentUser());
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    onToolSelected(tool: string): void {
        this.displayExtraToolsIndex = 99;
        this.changeDisplayedTool(tool);
        if (tool !== 'pointer') {
            this.mouseInteractor.unsetSelectedKonvaObject();
        }
        switch (tool) {
            case 'pointer':
                this.mouseService.setMouse(new OurKonvaPointer(this.author));
                break;
            case 'hand':
                this.mouseService.setMouse(new OurKonvaHand(this.author));
                break;
            case 'text':
                this.mouseService.setMouse(new OurKonvaText(this.author));
                break;
            case 'brush':
                this.mouseService.setMouse(new OurKonvaBrush(this.author));
                break;
            case 'eraser':
                this.mouseService.setMouse(new OurKonvaEraser(this.author));
                break;
            case 'square':
                this.mouseService.setMouse(new OurKonvaRect(this.author));
                break;
            case 'image':
                break;
            default:
                this.mouseService.setMouse(new OurKonvaPointer(this.author));
                break;
        }
    }

    async updateImage(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('asset', file);
        const newAsset: Asset = await this.imageService.uploadFile(formData);
        this.mouseService.setMouse(new OurKonvaImage(this.author, newAsset.uri));

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
        this.blocksOfTools[toolPackIndex].forEach(mapTool => {
            mapTool.displayed = mapTool.name === tool;
        });
        this.cdr.detectChanges();
    }
}
