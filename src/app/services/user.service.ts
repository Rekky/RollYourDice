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

    signIn(email: string, password: string, stayLogged: boolean): Promise<any> {
        return this.http.post<User>(`${this.apiService.API_URL}/users/authenticate`, { email, password })
            .pipe(map(user => {
                if (stayLogged) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
                return user;
            })).toPromise();
    }

    signUp(user: User): Promise<any> {
        const body = user;
        return this.http.post(`${this.apiService.API_URL}/users/register`, {user: body}).toPromise();
    }


}
