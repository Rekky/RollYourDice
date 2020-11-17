import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {GameEditorComponent} from './pages/game-editor/game-editor.component';
import {CharacterSheetComponent} from './components/character-sheet/character-sheet.component';
import {SignComponent} from './pages/sign/sign.component';
import {AuthGuardService} from './services/auth-guard.service';
import {AdventureComponent} from './pages/adventures/adventure/adventure.component';
import {AdventuresSearchComponent} from './pages/adventures/adventures-search/adventures-search.component';
import {AdventureNewComponent} from './pages/adventures/adventure-new/adventure-new.component';
import {MyAdventuresComponent} from './pages/adventures/my-adventures/my-adventures.component';
import {AdventuresComponent} from './pages/adventures/adventures/adventures.component';
import {PlayersGameComponent} from './pages/players-game/players-game.component';
import {GamePlayComponent} from './pages/game-play/game-play.component';

const routes: Routes = [
    {
        path: 'game-editor/:id',
        component: GameEditorComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'game-play/:id',
        component: GamePlayComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'play/:id',
        component: PlayersGameComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'character-sheet',
        component: CharacterSheetComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'sign',
        component: SignComponent,
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'adventures',
        component: AdventuresComponent,
        canActivate: [AuthGuardService],
        children: [
            { path: 'my-adventures', component: MyAdventuresComponent },
            { path: 'new', component: AdventureNewComponent },
            { path: 'search', component: AdventuresSearchComponent },
            { path: ':id', component: AdventureComponent }
        ]
    },
    {
        path: '**',
        component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
