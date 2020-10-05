import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ApiService} from './api.service';
import {User} from '../classes/User';
import {map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private apiService: ApiService, private httpService: HttpService) {}

    signIn(email: string, password: string): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                // Authorization: this.sessionService.getSessionToken()
                Authorization: ''
            })
        };

        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/users/authenticate`, { email, password }, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    signUp(user: User): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                // Authorization: this.sessionService.getSessionToken()
                Authorization: ''
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/users/register`, {user: user}, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }


}
