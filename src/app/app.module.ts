import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MapPropertiesComponent } from './pages/game-editor/map-properties/map-properties.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { GameEditorComponent } from './pages/game-editor/game-editor.component';
import { EditorToolsComponent } from './components/editor-tools/editor-tools.component';
import { EditorLibrariesComponent } from './pages/game-editor/editor-libraries/editor-libraries.component';
import { MapComponent } from './components/map/map.component';
import {DragulaModule} from 'ng2-dragula';
import { MapsListComponent } from './pages/game-editor/maps-list/maps-list.component';
import { RecursiveListComponent } from './components/recursive-list/recursive-list.component';
import { CharacterSheetComponent } from './components/character-sheet/character-sheet.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import {MatDialogModule} from '@angular/material/dialog';
import { KonvaBrushPropertiesComponent } from './components/konva-tools/konva-brush-properties/konva-brush-properties.component';
import { KonvaEraserPropertiesComponent } from './components/konva-tools/konva-eraser-properties/konva-eraser-properties.component';
import { KonvaTextPropertiesComponent } from './components/konva-tools/konva-text-properties/konva-text-properties.component';
import { KonvaRectanglePropertiesComponent } from './components/konva-tools/konva-rectangle-properties/konva-rectangle-properties.component';
import { GamePlayComponent } from './pages/game-play/game-play.component';
import { ImagesCarrouselComponent } from './components/images-carrousel/images-carrousel.component';
import { EditGameDataComponent } from './components/edit-game-data/edit-game-data.component';
import { IngameNavbarComponent } from './components/ingame-navbar/ingame-navbar.component';
import { MainMenuComponent } from './pages/adventures/menu/main-menu.component';
import {PostCardVerticalComponent} from './components/post-card-vertical/post-card-vertical.component';
import {AssetComponent} from './components/asset/asset.component';
import { UploadInputComponent } from './components/upload-input/upload-input.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { AccountComponent } from './pages/account/account.component';
import {EnumToArrayPipe} from './pipes/enum-to-array-pipe';
import {AuthInterceptor} from './interceptors/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MapPropertiesComponent,
        GameEditorComponent,
        EditorToolsComponent,
        EditorLibrariesComponent,
        MapComponent,
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
        SignComponent,
        ErrorMessageComponent,
        KonvaBrushPropertiesComponent,
        KonvaEraserPropertiesComponent,
        KonvaTextPropertiesComponent,
        KonvaRectanglePropertiesComponent,
        GamePlayComponent,
        ImagesCarrouselComponent,
        EditGameDataComponent,
        IngameNavbarComponent,
        MainMenuComponent,
        PostCardVerticalComponent,
        AssetComponent,
        UploadInputComponent,
        DropdownComponent,
        AccountComponent,
        EnumToArrayPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        DragulaModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MatDialogModule,
    ],
    exports: [EnumToArrayPipe],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    entryComponents: [ErrorMessageComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): any {
    return new TranslateHttpLoader(http);
}
