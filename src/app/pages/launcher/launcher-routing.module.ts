import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import {LauncherComponent} from './launcher.component';
import {MainMenuComponent} from './menu/main-menu.component';
import {MyAdventuresComponent} from './my-adventures/my-adventures.component';

const routes: Routes = [
    {
        path: 'launcher',
        redirectTo: '/launcher/menu',
        pathMatch: 'full',
    },
    {
        path: 'launcher',
        component: LauncherComponent,
        canActivate: [AuthGuardService],
        children: [
            { path: 'menu', component: MainMenuComponent },
            { path: 'adventures', component: MyAdventuresComponent },
        ],
    },
    {
        path: '',
        redirectTo: '/launcher/menu',
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LauncherRoutingModule { }
