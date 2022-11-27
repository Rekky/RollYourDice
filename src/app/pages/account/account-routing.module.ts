import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SignInComponent} from './sign-in/sign-in.component';
import {AccountComponent} from './account.component';
import {SignUpComponent} from './sign-up/sign-up.component';

const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent,
            },
            {
                path: 'sign-up',
                component: SignUpComponent,
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
