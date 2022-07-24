import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';


@Component({
    selector: 'app-modal-custom',
    templateUrl: './modal-custom.component.html',
    styleUrls: ['./modal-custom.component.scss']
})
export class ModalCustomComponent implements OnInit {

    @Input() open = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    windowWidth: number = 0;

    constructor() {
        this.windowWidth = window.innerWidth;
    }

    ngOnInit(): void {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event): void {
        this.windowWidth = event.target.innerWidth;
        console.log(this.windowWidth);
    }

    close(): void {
        this.open = false;
        this.openChange.emit(this.open);
    }

}
