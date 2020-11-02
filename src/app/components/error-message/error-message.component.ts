import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<ErrorMessageDialogOptions>,
        private ngZone: NgZone,
        @Inject(MAT_DIALOG_DATA) public data: ErrorMessageDialogOptions
    ) { }

    ngOnInit(): void {
    }

    closeDialog(): void {
        this.ngZone.run(() => {
            this.dialogRef.close();
        });
    }
}

export interface ErrorMessageDialogOptions {
    error: string | number;
    message: string;
}
