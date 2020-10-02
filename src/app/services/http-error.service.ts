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
        console.log('HTTP ERROR');

        const statusCode: number = httpError.status;
        switch (statusCode) {
            case 403:
                this.error403NotifierSubject.next(true);
                break;
            case 200:
                break;
            default:
                console.log('Generic Error');
                break;
        }

        if (doNotify) {
            // TODO
            console.log('Error ' + httpError.status + ' received');
            // TODO

            const errorStrKey: string = 'HTTPCODES.' + statusCode + '.MESSAGE';
            let errorMessage: string = this.translateService.instant(errorStrKey);
            if (errorMessage === errorStrKey) {
                // no existe el mensaje específico
                errorMessage = this.translateService.instant('HTTPCODES.DEFAULT');
            }

            this.notificationsService.showErrorNotification(statusCode, errorMessage);
        }


        // TODO

        // TODO

        // TODO
    }

    public getError403NotifierSubscription(): Observable<boolean> {
        return this.error403NotifierSubject.asObservable();
    }
}
