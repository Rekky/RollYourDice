import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../classes/User';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    protected endPointName: string = 'users';

    constructor(private http: HttpClient, private httpService: HttpService) {}

    signIn(email: string, password: string): Promise<any> {
        const data = {email, password};
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}/login`, data).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    signUp(user: User): Promise<any> {
        const data = {email: user.email, password: user.password, username: user.username};
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}/register`, data).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
