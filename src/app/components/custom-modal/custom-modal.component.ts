import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';


@Component({
    selector: 'app-custom-modal',
    templateUrl: './custom-modal.component.html',
    styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent implements OnInit {

    @Input() open = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() title: string = '';
    @Input() type: string = 'medium';
    @Input() bgColor: string = 'dark';
    windowWidth: number = 0;

    constructor() {
        this.windowWidth = window.innerWidth;
    }

    ngOnInit(): void {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event): void {
        this.windowWidth = event.target.innerWidth;
    }

    close(): void {
        this.open = false;
        this.openChange.emit(this.open);
    }

}
