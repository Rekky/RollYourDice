import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as envProd from 'src/environments/environment.prod';
import { HttpErrorService } from './http-error.service';


/**
 * Basic HTTP operations
 */
@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(
        private http: HttpClient,
        private httpErrorService: HttpErrorService
    ) { }

    // HTTP
    // Basic server calls

    /**
     * This call gets data from the server
     */
    public get(url: string, options?: any): Observable<any> {
        return new Observable<any>(observable => {
            this.http.get(environment.api_url + url, { params: options ? options.params : null, observe: 'response' }).subscribe(
                (response) => {
                    observable.next(response.body);
                }, (error: HttpErrorResponse) => {
                    this.httpErrorService.manageError(error, true);
                    observable.error(error);
                }
            );
        });
    }

    /**
     * This call sends data to the server
     */
    public post(url: string, body: any): Observable<any> {
        return new Observable<any>(observable => {
            this.http.post(environment.api_url + url, body, { observe: 'response' }).subscribe(
                (response) => {
                    observable.next(response.body);
                }, (error: HttpErrorResponse) => {
                    this.httpErrorService.manageError(error, true);
                    observable.error(error);
                }
            );
        });
    }

    /**
     * a testing call
     * @param url a complate url in string format
     * @param body a params for send to server
     */
    public postTest(url: string, body: any): Observable<any> {
        return new Observable<any>(observable => {
            this.http.post(envProd.environment.api_url + url, body, { observe: 'response' }).subscribe(
                (response) => {
                    observable.next(response.body);
                }, (error: HttpErrorResponse) => {
                    this.httpErrorService.manageError(error, true);
                    observable.error(error);
                }
            );
        });
    }

    /**
     * This call overwrites specified attributes of a piece of data
     */
    public patch(url: string, body: any): Observable<any> {
        return new Observable<any>(observable => {
            this.http.patch(environment.api_url + url, body, { observe: 'response' }).subscribe(
                (response) => {
                    observable.next(response.body);
                }, (error: HttpErrorResponse) => {
                    this.httpErrorService.manageError(error, true);
                    observable.error(error);
                }
            );
        });
    }

    /**
     * This call removes specified data from the server
     */
    public delete(url: string): Observable<any> {
        return new Observable<any>(observable => {
            this.http.delete(environment.api_url + url, { observe: 'response' }).subscribe(
                (response) => {
                    observable.next(response.body);
                }, (error: HttpErrorResponse) => {
                    this.httpErrorService.manageError(error, true);
                    observable.error(error);
                }
            );
        });
    }

}
