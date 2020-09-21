import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {User} from '../classes/User';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private apiService: ApiService) {

    }

    signIn(email: string, password: string): any {
        console.log('signIn', email + password);
        return this.http.post<User>(`${this.apiService.API_URL}/users/sign-in`, { email, password })
            .pipe(map(user => {
                localStorage.setItem('user', JSON.stringify(user));
                // this.userSubject.next(user);
                // return user;
            }));
    }

    signUp(user: User): any {
        return this.http.post(`${this.apiService.API_URL}/users/register`, {user}).subscribe();
    }


}
