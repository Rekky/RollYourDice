import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from './notifications.service';
import {Router} from '@angular/router';

/**
 * Service created to manage HttpErrors in a generic way
 * It can emit events for loading indicators to stop or pages to redirect
 */
@Injectable({
    providedIn: 'root'
})
export class HttpErrorService {

    constructor(
        private notificationsService: NotificationsService,
        private router: Router,
        private translateService: TranslateService
    ) { }

    public manageError(httpError: HttpErrorResponse, doNotify: boolean = true): void {
        if (doNotify) {

            // if (httpError.status === 0) {
            //     this.notificationsService.showErrorNotification('Cannot connect to server');
            //     return;
            // }
            //
            // if (httpError.error.message === 'Expired') {
            //     localStorage.removeItem('rollUser');
            //     localStorage.removeItem('rollToken');
            //     this.router.navigateByUrl('/account/sign-in');
            //     return;
            // }
            // console.log(httpError.error.message);
            // this.notificationsService.showErrorNotification(httpError.error.message);
        }
    }
}
