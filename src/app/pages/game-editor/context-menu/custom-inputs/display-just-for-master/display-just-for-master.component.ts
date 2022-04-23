import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-display-just-for-master',
    templateUrl: './display-just-for-master.component.html',
    styleUrls: ['./display-just-for-master.component.scss']
})
export class DisplayJustForMasterComponent implements OnInit {
    @Input() isDisplayed: boolean;
    @Output() isDisplayedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
    }

    toggleDisplay(): void {
        this.isDisplayed = !this.isDisplayed;
        this.isDisplayedChange.emit(this.isDisplayed);
    }

}
