import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserInteractor} from '../../interactors/UserInteractor';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    signInForm: FormGroup;

    constructor(private userInteractor: UserInteractor) { }

    ngOnInit(): void {
        this.signInForm = new FormGroup({
            email: new FormControl(null),
            password: new FormControl(null)
        });
    }

    signIn(): void  {
        const email = this.signInForm.get('email').value;
        const pass = this.signInForm.get('password').value;
        this.userInteractor.signIn(email, pass);
    }

}
