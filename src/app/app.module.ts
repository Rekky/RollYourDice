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
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {HttpClientModule} from '@angular/common/http';
import { AdventureComponent } from './pages/adventures/adventure/adventure.component';
import { AdventuresSearchComponent } from './pages/adventures/adventures-search/adventures-search.component';
import { AdventureNewComponent } from './pages/adventures/adventure-new/adventure-new.component';
import { MyAdventuresComponent } from './pages/adventures/my-adventures/my-adventures.component';
import { AdventuresComponent } from './pages/adventures/adventures/adventures.component';
import { CsHeaderComponent } from './components/character-sheet/cs-header/cs-header.component';
import { CsAttributesComponent } from './components/character-sheet/cs-attributes/cs-attributes.component';
import { CsSavingThrowsComponent } from './components/character-sheet/cs-saving-throws/cs-saving-throws.component';
import { CsSkillsComponent } from './components/character-sheet/cs-skills/cs-skills.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {SignComponent} from './pages/sign/sign.component';

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
    SignUpComponent,
    AdventureComponent,
    AdventuresSearchComponent,
    AdventureNewComponent,
    MyAdventuresComponent,
    AdventuresComponent,
    CsHeaderComponent,
    CsAttributesComponent,
    CsSavingThrowsComponent,
    CsSkillsComponent,
    NavBarComponent,
    SignComponent
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
