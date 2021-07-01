import {Component, OnDestroy, OnInit} from '@angular/core';


@Component({
    selector: 'app-adventure-new',
    templateUrl: './adventure-new.component.html',
    styleUrls: ['./adventure-new.component.scss']
})
export class AdventureNewComponent implements OnInit, OnDestroy {

    constructor() { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {

    }

    async createGame(): Promise<void> {

    }

}
