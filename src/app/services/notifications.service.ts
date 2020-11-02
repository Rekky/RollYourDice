import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ErrorMessageComponent, ErrorMessageDialogOptions} from '../components/error-message/error-message.component';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    constructor(
        private dialog: MatDialog,
    ) { }

    showNotification(title: string, message: string): void {
        // console.log('Notification: ', title, '-', message);
    }

    showErrorNotification(title: number, message: string): void {
        const dialogOptions: ErrorMessageDialogOptions = {
            error: title,
            message: message
        };

        this.dialog.open(ErrorMessageComponent, {
            data: dialogOptions
        });
    }

}
