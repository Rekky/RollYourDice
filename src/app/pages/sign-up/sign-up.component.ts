import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserInteractor} from '../../interactors/UserInteractor';
import {User} from '../../classes/User';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

    signUpForm: FormGroup;

    constructor(private userInteractor: UserInteractor) { }

    ngOnInit(): void {
        this.signUpForm = new FormGroup({
            username: new FormControl(null),
            email: new FormControl(null),
            password: new FormControl(null),
            repeatPassword: new FormControl(null)
        });
    }

    async signUp(): Promise<void>  {
        const username = this.signUpForm.get('username').value;
        const email = this.signUpForm.get('email').value;
        const pass = this.signUpForm.get('password').value;

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = pass;

        try {
            await this.userInteractor.signUp(user);
        } catch (e) {
            console.log(e.error);
        }
    }

}
