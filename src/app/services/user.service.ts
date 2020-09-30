import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {User} from '../classes/User';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private apiService: ApiService) {}

    signIn(email: string, password: string): Promise<User> {
        return this.http.post<User>(`${this.apiService.API_URL}/users/authenticate`, { email, password })
            .pipe(map(user => {
                return user;
            })).toPromise();
    }

    signUp(user: User): Promise<any> {
        return this.http.post(`${this.apiService.API_URL}/users/register`, {user: user}).toPromise();
    }


}
