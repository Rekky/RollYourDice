import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {User} from '../../../classes/User';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

    @Output() display: EventEmitter<'signIn'> = new EventEmitter<'signIn'>();
    signUpForm: FormGroup;
    displayPassword: boolean = false;
    displayRepeatPassword: boolean = false;

    constructor(private userInteractor: UserInteractor, private router: Router) { }

    ngOnInit(): void {
        this.signUpForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required),
            repeatPassword: new FormControl(null, Validators.required)
        });
    }

    async signUp(): Promise<void>  {
        const username = this.signUpForm.get('username').value;
        const email = this.signUpForm.get('email').value;
        const pass = this.signUpForm.get('password').value;
        const repeatPass = this.signUpForm.get('repeatPassword').value;

        if (pass !== repeatPass) {
            alert('must be the same password');
            return;
        }

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = pass;

        try {
            await this.userInteractor.signUp(user);
            this.display.emit('signIn');
        } catch (e) {
            console.log(e.error);
        }
    }

    alreadyHaveAccount(): void {
        this.display.emit('signIn');
    }

}