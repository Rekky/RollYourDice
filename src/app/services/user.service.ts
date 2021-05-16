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
        const data = {email, password};

        const options = {
            headers: new HttpHeaders({
                Authorization: ''
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/user/login`, data, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    signUp(user: User): Promise<any> {
        const data = {user};

        const options = {
            headers: new HttpHeaders({
                Authorization: ''
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/user/register`, data, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }


}
