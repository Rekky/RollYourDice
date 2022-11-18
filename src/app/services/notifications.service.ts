import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    NotificationComponent,
    NotificationMessageDialogOptions
} from '../components/notification/notification.component';

export class Toast {
    id: string;
    message: string;
    duration: number;
    htmlRender: string;

    constructor(message: string, duration?: number) {
        this.id = 'toast-simple-' + (Math.floor(Math.random() * (1000 - 1) + 1)).toString();
        this.message = message;
        this.duration = duration;
        this.htmlRender = `
        <div id="${this.id}" class="relative top-5 right-5 z-[9999] mt-[10px] opacity-0 transition duration-500 ease-out flex items-center p-4 space-x-4 w-full max-w-xs text-gray-500 bg-white rounded-lg divide-x divide-gray-200 shadow" role="alert">
        <svg class="fill-blue-500 h-[16px]" viewBox="0 0 46 48" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.0002 0C12.5068 0 4.00017 8.50659 4.00017 19V32.5335C4.00017 32.8383 3.9145 33.1371 3.75292 33.3956L0.912672 37.94C0.0801118 39.2721 1.0378 41 2.60867 41H43.3917C44.9625 41 45.9202 39.2721 45.0877 37.94L42.2474 33.3956C42.0858 33.1371 42.0002 32.8383 42.0002 32.5335V19C42.0002 8.50659 33.4936 0 23.0002 0ZM23.0002 48C20.2388 48 18.0002 45.7614 18.0002 43H28.0002C28.0002 45.7614 25.7616 48 23.0002 48Z"></path></svg>
        <div class="pl-4 text-sm font-normal">${this.message}</div>
        </div>
        `;
    }

    show(): void {
        const toastContainer = document.createElement('div');
        toastContainer.innerHTML = this.htmlRender.trim();
        document.getElementById('toasters').appendChild(toastContainer.firstChild);
        setTimeout(() => {
            document.getElementById(this.id).classList.remove('opacity-0');
        }, 100);
        setTimeout(() => {
            document.getElementById(this.id).classList.add('opacity-0');
        }, this.duration);
        setTimeout(() => {
            document.getElementById(this.id).remove();
        }, this.duration + 500);
    }
}

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

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

    simple(message: string, duration: number): void {
        const toast: Toast = new Toast(message, duration);
        toast.show();
    }

}
