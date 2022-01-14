import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from './notifications.service';
import {Router} from '@angular/router';
import {UserInteractor} from '../interactors/UserInteractor';

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
        private router: Router,
        private translateService: TranslateService
    ) { }

    public manageError(httpError: HttpErrorResponse, doNotify: boolean = true): void {
        if (doNotify) {
            this.notificationsService.showErrorNotification(httpError.error.message);

            if (httpError.error.message === 'Expired') {
                localStorage.removeItem('rollUser');
                localStorage.removeItem('rollToken');
                this.router.navigateByUrl('/sign');
            }
        }
    }
}
