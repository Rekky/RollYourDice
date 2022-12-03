import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {UserInteractor} from '../interactors/UserInteractor';
import jwt_decode from 'jwt-decode';
import {catchError} from 'rxjs/operators';
import {NotificationsService} from '../services/notifications.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userInteractor: UserInteractor, private notificationsService: NotificationsService,) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const authToken: string = this.userInteractor.getCurrentToken();
      if (authToken) {
          request = request.clone({
              setHeaders: {
                  Authorization: authToken
              },
          });
      }
      return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
              let errorMsg = '';
              if (error.error.errors) {
                  errorMsg = '' + error.error.errors.message;
                  this.notificationsService.showErrorNotification(errorMsg);
              }
              return throwError(errorMsg);
          })
      );
  }
}
