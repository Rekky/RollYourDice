import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Router} from '@angular/router';
import {User} from '../../classes/User';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    @Output() display: EventEmitter<'signUp'> = new EventEmitter<'signUp'>();
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
        console.log('yup?');

        try {
            const user = await this.userInteractor.signIn(email, pass, stayLogged);
            console.log(user);
            this.router.navigate(['/home']);
        } catch (e) {
            console.log(e.error);
        }
    }

    createAccount(): void {
        this.display.emit('signUp');
    }
}
