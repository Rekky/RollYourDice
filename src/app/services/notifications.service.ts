import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    NotificationComponent,
    NotificationMessageDialogOptions
} from '../components/notification/notification.component';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    public toasts$: BehaviorSubject<any[]> = new BehaviorSubject([]);

    constructor(private dialog: MatDialog) { }

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

    toastSuccess(message: string): void {
        const oldToasts = this.toasts$.value;
        oldToasts.push(message);
        this.toasts$.next(oldToasts);
    }

}
