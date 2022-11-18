import {Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-custom-toasters',
    templateUrl: './custom-toasters.component.html',
    styleUrls: ['./custom-toasters.component.scss']
})
export class CustomToastersComponent implements OnInit {

    constructor(public notificationService: NotificationsService) {
    }

    ngOnInit(): void {
    }
}
