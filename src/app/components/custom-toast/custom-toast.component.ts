import {Component, Input, OnInit} from '@angular/core';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-custom-toast',
    templateUrl: './custom-toast.component.html',
    styleUrls: ['./custom-toast.component.scss']
})
export class CustomToastComponent implements OnInit {

    @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right';
    @Input() duration: number = 1000;
    show: boolean = false;

    constructor(public notificationsService: NotificationsService) {

    }

    ngOnInit(): void {

    }

}
