import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../../services/auth-guard.service';
import {NgModule} from '@angular/core';
import {GameEditorComponent} from './game-editor.component';

const routes: Routes = [
    {
        path: ':id',
        component: GameEditorComponent,
        canActivate: [AuthGuardService],
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
export class GameEditorRoutingModule { }
