import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-block-object-edition',
    templateUrl: './block-object-edition.component.html',
    styleUrls: ['./block-object-edition.component.scss']
})
export class BlockObjectEditionComponent implements OnInit {
    @Input() isBlocked: boolean;
    @Output() isBlockedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {}

    toggleIsBlocked(): void {
        this.isBlocked = !this.isBlocked;
        this.isBlockedChange.emit(this.isBlocked);
    }

}
