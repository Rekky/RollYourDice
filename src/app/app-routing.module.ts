import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {GameEditorComponent} from './pages/game-editor/game-editor.component';
import {CharacterSheetComponent} from './components/character-sheet/character-sheet.component';

const routes: Routes = [
    {
        path: 'game-editor',
        component: GameEditorComponent,
    },
    {
        path: 'character-sheet',
        component: CharacterSheetComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
