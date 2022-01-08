import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Router} from '@angular/router';
import {User} from '../../../classes/User';
import {OurKonvaMap} from '../../../classes/ourKonva/OurKonvaMap';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {

    @Output() display: EventEmitter<'signUp' | 'signIn' | 'loaded'> = new EventEmitter<'signUp'>();
    signInForm: FormGroup;
    displayPassword: boolean = false;

    constructor(private userInteractor: UserInteractor,
                private router: Router) { }

    ngOnInit(): void {
        this.signInForm = new FormGroup({
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required),
            stayLogged: new FormControl(false),
        });
    }

    ngAfterViewInit(): void {
        document.getElementById('email').focus();
    }

    async signIn(): Promise<void> {
        const email = this.signInForm.get('email').value;
        const pass = this.signInForm.get('password').value;
        const stayLogged = this.signInForm.get('stayLogged').value;

        try {
            await this.userInteractor.signIn(email, pass, stayLogged);
            this.display.emit('loaded');
        } catch (e) {
            // error handle
            this.signInForm.get('password').setValue('');
        }
    }

    createAccount(): void {
        this.display.emit('signUp');
    }
}
