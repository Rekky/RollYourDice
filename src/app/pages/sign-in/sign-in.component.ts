import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    signInForm: FormGroup;

    constructor(private userInteractor: UserInteractor, private router: Router) { }

    ngOnInit(): void {
        this.signInForm = new FormGroup({
            email: new FormControl(null),
            password: new FormControl(null)
        });
    }

    async signIn(): Promise<void> {
        const email = this.signInForm.get('email').value;
        const pass = this.signInForm.get('password').value;

        try {
            await this.userInteractor.signIn(email, pass);
            this.userInteractor.user.subscribe((res) => {
                this.router.navigate(['/home']);
            });
        } catch (e) {
            console.log(e.error);
        }
    }

}
