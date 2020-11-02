import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
            this.http.get(environment.api_url + url, { headers: options ? options.headers : null, observe: 'response' }).subscribe(
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
    public post(url: string, body: any, options?: any): Observable<any> {
        return new Observable<any>(observable => {
            this.http.post(environment.api_url + url, body, { headers: options ? options.headers : null, observe: 'response' }).subscribe(
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
    public patch(url: string, body: any, options?: any): Observable<any> {
        // return this.http.patch(environment.apiUrl + url, body, options);
        return new Observable<any>(observable => {
            this.http.patch(environment.api_url + url, body, { headers: options ? options.headers : null, observe: 'response' }).subscribe(
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
    public delete(url: string, options?: any): Observable<any> {
        // return this.http.delete(environment.apiUrl + url, options);
        return new Observable<any>(observable => {
            this.http.delete(environment.api_url + url, { headers: options ? options.headers : null, observe: 'response' }).subscribe(
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
