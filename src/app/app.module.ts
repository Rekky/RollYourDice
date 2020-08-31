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
    MapsListComponent
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
