import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

@Component({
    selector: 'app-more-options',
    templateUrl: './more-options.component.html',
    styleUrls: ['./more-options.component.scss']
})
export class MoreOptionsComponent implements OnInit {
    @Output() itemToTop: EventEmitter<void> = new EventEmitter<void>();
    @Output() itemToBottom: EventEmitter<void> = new EventEmitter<void>();

    displayMoreOptions: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    moveElementToTop(): void {
        this.itemToTop.emit();
    }

    moveElementToBottom(): void {
        this.itemToBottom.emit();
    }

}
