import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    NotificationComponent,
    NotificationMessageDialogOptions
} from '../components/notification/notification.component';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    constructor(
        private dialog: MatDialog,
    ) { }

    showNotification(message: string): void {
        const dialogOptions: NotificationMessageDialogOptions = {
            type: 'success',
            message: message
        };

        this.dialog.open(NotificationComponent, {
            data: dialogOptions
        });
    }

    showErrorNotification(message: string): void {
        const dialogOptions: NotificationMessageDialogOptions = {
            type: 'error',
            message: message
        };

        this.dialog.open(NotificationComponent, {
            data: dialogOptions
        });
    }

}
