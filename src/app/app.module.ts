import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MapPropertiesComponent } from './pages/game-editor/map-properties/map-properties.component';
import {ReactiveFormsModule} from '@angular/forms';
import { GameEditorComponent } from './pages/game-editor/game-editor.component';
import { EditorToolsComponent } from './components/editor-tools/editor-tools.component';
import { EditorLibrariesComponent } from './pages/game-editor/editor-libraries/editor-libraries.component';
import { MapComponent } from './components/map/map.component';
import { PagesListComponent } from './pages/game-editor/pages-list/pages-list.component';
import {DragulaModule} from 'ng2-dragula';
import { PageComponent } from './pages/game-editor/page/page.component';
import { MapsListComponent } from './pages/game-editor/maps-list/maps-list.component';
import { RecursiveListComponent } from './components/recursive-list/recursive-list.component';
import { CharacterSheetComponent } from './components/character-sheet/character-sheet.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapPropertiesComponent,
    GameEditorComponent,
    EditorToolsComponent,
    EditorLibrariesComponent,
    MapComponent,
    PagesListComponent,
    PageComponent,
    MapsListComponent,
    RecursiveListComponent,
    CharacterSheetComponent,
    SignInComponent,
    SignUpComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        DragulaModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
