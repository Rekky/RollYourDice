import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MapPropertiesComponent } from './game-editor/map-properties/map-properties.component';
import {ReactiveFormsModule} from '@angular/forms';
import { GameEditorComponent } from './game-editor/game-editor.component';
import { EditorToolsComponent } from './game-editor/editor-tools/editor-tools.component';
import { EditorLibrariesComponent } from './game-editor/editor-libraries/editor-libraries.component';
import { MapComponent } from './game-editor/map/map.component';
import { PagesListComponent } from './game-editor/pages-list/pages-list.component';
import {DragulaModule} from 'ng2-dragula';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapPropertiesComponent,
    GameEditorComponent,
    EditorToolsComponent,
    EditorLibrariesComponent,
    MapComponent,
    PagesListComponent
  ],
    imports: [
        BrowserModule,
        DragulaModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
