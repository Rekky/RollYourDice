import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {SharedModule} from '../../shared.module';
import { AccountRoutingModule } from './account-routing.module';
import {AccountComponent} from './account.component';


@NgModule({
    declarations: [
        SignInComponent,
        SignUpComponent,
        AccountComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        AccountRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        MatDialogModule
    ],
})

export class AccountModule { }
