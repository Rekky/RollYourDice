import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-error-message',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<NotificationMessageDialogOptions>,
        private ngZone: NgZone,
        @Inject(MAT_DIALOG_DATA) public data: NotificationMessageDialogOptions
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.closeDialog();
        }, 3000);
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }
}

export interface NotificationMessageDialogOptions {
    message: string;
    type: 'error' | 'success';
}
