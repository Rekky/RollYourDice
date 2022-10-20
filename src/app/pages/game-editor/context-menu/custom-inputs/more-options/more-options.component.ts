import {EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import {MouseInteractor} from '../../../../../interactors/MouseInteractor';

@Component({
    selector: 'app-more-options',
    templateUrl: './more-options.component.html',
    styleUrls: ['./more-options.component.scss']
})
export class MoreOptionsComponent implements OnInit {
    @Input() settings: MoreOptionsModel = new MoreOptionsModel();

    displayMoreOptions: boolean = false;

    constructor(private mouseInteractor: MouseInteractor) {
    }

    ngOnInit(): void {
    }

    moveElementToTop(): void {
        this.mouseInteractor.moveSelectedElementToTop();
    }

    moveElementToBottom(): void {
        this.mouseInteractor.moveSelectedElementToBottom();
    }

    moveElementUp(): void {
        this.mouseInteractor.moveSelectedElementUp();
    }

    moveElementDown(): void {
        this.mouseInteractor.moveSelectedElementDown();
    }

    setAsBackgroundImage(): void {
        this.mouseInteractor.setAsBackgroundImage();
    }

}

export class MoreOptionsModel {
    isDisplayed: boolean;
    setAsBackgroundImage: {
        isDisplayed: boolean,
    };
    moveElementUp: {
        isDisplayed: boolean,
    };
    moveElementDown: {
        isDisplayed: boolean,
    };
    moveElementToTop: {
        isDisplayed: boolean,
    };
    moveElementToBottom: {
        isDisplayed: boolean,
    };

    constructor() {
        this.isDisplayed = true;
        this.setAsBackgroundImage = {
            isDisplayed: true,
        };
        this.moveElementUp = {
            isDisplayed: true,
        };
        this.moveElementDown = {
            isDisplayed: true,
        };
        this.moveElementToTop = {
            isDisplayed: true,
        };
        this.moveElementToBottom = {
            isDisplayed: true,
        };
    }

    static fromJSON(json): MoreOptionsModel {
        return {...new MoreOptionsModel(), ...json};
    }
}
