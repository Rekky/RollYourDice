import {Component} from '@angular/core';
import {NotificationsService} from './services/notifications.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(public notificationService: NotificationsService) {
        setInterval(() => {
            // this.notificationService.toastSuccess(Math.random().toString());
        }, 3000);
    }

}
