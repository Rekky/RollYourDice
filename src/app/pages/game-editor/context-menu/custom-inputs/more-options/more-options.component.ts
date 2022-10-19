import { EventEmitter } from '@angular/core';
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
    @Output() itemToTop: EventEmitter<void> = new EventEmitter<void>();
    @Output() itemToBottom: EventEmitter<void> = new EventEmitter<void>();

    displayMoreOptions: boolean = false;

    constructor(private mouseInteractor: MouseInteractor) { }

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
