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
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/user/login`, data).subscribe(
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
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/user/register`, data).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
