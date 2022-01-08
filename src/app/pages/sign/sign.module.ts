import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LauncherRoutingModule} from '../launcher/launcher-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {SignComponent} from './sign.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {SharedModule} from '../../shared.module';


@NgModule({
    declarations: [
        SignComponent,
        SignInComponent,
        SignUpComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        LauncherRoutingModule,
        ReactiveFormsModule,
        MatDialogModule,
        SharedModule
    ],
})

export class SignModule { }
