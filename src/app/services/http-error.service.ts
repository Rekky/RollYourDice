import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from './notifications.service';

/**
 * Service created to manage HttpErrors in a generic way
 * It can emit events for loading indicators to stop or pages to redirect
 */
@Injectable({
    providedIn: 'root'
})
export class HttpErrorService {

    error403NotifierSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private notificationsService: NotificationsService,
        private translateService: TranslateService
    ) { }

    public manageError(httpError: HttpErrorResponse, doNotify: boolean = true): void {
        console.error('HTTP ERROR');
        const statusCode: number = httpError.status;

        // if (doNotify) {
        //     console.error('Error ' + httpError.status + ' received');
        //     const errorStrKey: string = 'HTTPCODES.' + statusCode + '.MESSAGE';
        //     let errorMessage: string = this.translateService.instant(errorStrKey);
        //     if (errorMessage === errorStrKey) {
        //         // no existe el mensaje específico
        //         errorMessage = this.translateService.instant('HTTPCODES.DEFAULT');
        //     }
        //
        //     this.notificationsService.showErrorNotification(statusCode, errorMessage);
        // }
        if (doNotify) {
            console.error('Error ' + httpError.status + ' received');
            this.notificationsService.showErrorNotification(statusCode, httpError.message);
        }
    }
}
