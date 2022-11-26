import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {UserInteractor} from '../../../interactors/UserInteractor';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {

    @Output() display: EventEmitter<'signUp' | 'signIn' | 'loaded'> = new EventEmitter<'signUp'>();
    signInForm: UntypedFormGroup;
    loading: boolean = false;

    constructor(private userInteractor: UserInteractor) { }

    ngOnInit(): void {
        this.signInForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, Validators.required)
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
            this.display.emit('loaded');
        } catch (e) {
            this.signInForm.get('password').setValue('');
        } finally {
            this.loading = false;
        }
    }

    createAccount(): void {
        this.display.emit('signUp');
    }
}
