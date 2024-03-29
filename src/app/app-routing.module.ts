import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CharacterSheetComponent} from './components/character-sheet/character-sheet.component';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/launcher/launcher.module').then((m) => m.LauncherModule),
    },
    {
        path: 'game-editor',
        loadChildren: () => import('./pages/game-editor/game-editor.module').then((m) => m.GameEditorModule),
    },
    {
        path: 'character-sheet',
        component: CharacterSheetComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'account',
        loadChildren: () => import('./pages/account/account.module').then((m) => m.AccountModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
