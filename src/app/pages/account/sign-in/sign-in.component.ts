import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Router} from '@angular/router';
declare var google: any;

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
        google.accounts.id.initialize({
            client_id: '68833047415-8euts71spubf3lnqlm0e84kolrs84gmo.apps.googleusercontent.com',
            callback: this.signInWithGoogle.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,

        });
        google.accounts.id.renderButton(
            document.getElementById('google-button'),
            { theme: 'outline', size: 'large', width: '100%' }
        );
        google.accounts.id.prompt((notification: any) => {});

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

    async signInWithGoogle(response: any): Promise<void> {
        this.loading = true;
        const credential = response;

        try {
            await this.userInteractor.signInWithGoogle(credential);
            await this.router.navigateByUrl('');
        } catch (e) {
            console.log(e);
        } finally {
            this.loading = false;
        }
    }
}
