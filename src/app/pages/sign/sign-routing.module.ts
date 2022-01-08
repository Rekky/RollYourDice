import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../../services/auth-guard.service';
import {NgModule} from '@angular/core';
import {SignComponent} from './sign.component';

const routes: Routes = [
    {
        path: '',
        component: SignComponent,
        canActivate: [AuthGuardService],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SignRoutingModule { }
