import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {User} from '../classes/User';
import {map} from 'rxjs/operators';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private apiService: ApiService, private httpService: HttpService) {}

    signIn(email: string, password: string): Promise<User> {
        return this.httpService.post(`/users/authenticate`, { email, password })
            .pipe(map(user => {
                return user;
            })).toPromise();
    }

    signUp(user: User): Promise<any> {
        return this.httpService.post(`/users/register`, {user: user}).toPromise();
    }


}
