import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../classes/User';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private httpService: HttpService) {}

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
