import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Router} from '@angular/router';
import {User} from '../../classes/User';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    signInForm: FormGroup;
    displayPassword: boolean = false;

    constructor(private userInteractor: UserInteractor, private router: Router) { }

    ngOnInit(): void {
        this.signInForm = new FormGroup({
            email: new FormControl(null),
            password: new FormControl(null),
            stayLogged: new FormControl(false),
        });
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.signInForm.patchValue({
                email: user.email,
                password: user.password,
                stayLogged: true
            });
        }
    }

    async signIn(): Promise<void> {
        const email = this.signInForm.get('email').value;
        const pass = this.signInForm.get('password').value;
        const stayLogged = this.signInForm.get('stayLogged').value;

        try {
            await this.userInteractor.signIn(email, pass, stayLogged);
            this.userInteractor.user.subscribe((res) => {
                this.router.navigate(['/home']);
            });
        } catch (e) {
            console.log(e.error);
        }
    }
}
