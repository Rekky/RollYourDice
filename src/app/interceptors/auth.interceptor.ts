import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserInteractor} from '../interactors/UserInteractor';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userInteractor: UserInteractor) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const authToken: string = this.userInteractor.getCurrentToken();
      if (authToken) {
          request = request.clone({
              setHeaders: {
                  Authorization: authToken
              },
          });
      }
      return next.handle(request);
  }
}
