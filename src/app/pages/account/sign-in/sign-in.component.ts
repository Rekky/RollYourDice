import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {

    signInForm: UntypedFormGroup;
    loading: boolean = false;

    constructor(private userInteractor: UserInteractor, private router: Router) { }

    ngOnInit(): void {
        this.signInForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, [Validators.required, Validators.email]),
            password: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)])
        });
    }

    ngAfterViewInit(): void {
        document.getElementById('email').focus();
    }

    async signIn(): Promise<void> {
        this.loading = true;
        const email = this.signInForm.get('email').value;
        const pass = this.signInForm.get('password').value;

        try {
            await this.userInteractor.signIn(email, pass);
            await this.router.navigateByUrl('');
        } catch (e) {
            this.signInForm.get('password').setValue('');
        } finally {
            this.loading = false;
        }
    }
}
