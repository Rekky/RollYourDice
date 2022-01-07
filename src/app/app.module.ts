import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MapComponent } from './components/map/map.component';
import {DragulaModule} from 'ng2-dragula';
import { RecursiveListComponent } from './components/recursive-list/recursive-list.component';
import { CharacterSheetComponent } from './components/character-sheet/character-sheet.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { CsHeaderComponent } from './components/character-sheet/cs-header/cs-header.component';
import { CsAttributesComponent } from './components/character-sheet/cs-attributes/cs-attributes.component';
import { CsSavingThrowsComponent } from './components/character-sheet/cs-saving-throws/cs-saving-throws.component';
import { CsSkillsComponent } from './components/character-sheet/cs-skills/cs-skills.component';
import {SignComponent} from './pages/sign/sign.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import {MatDialogModule} from '@angular/material/dialog';
import { KonvaBrushPropertiesComponent } from './components/konva-tools-properties/konva-brush-properties/konva-brush-properties.component';
import { KonvaEraserPropertiesComponent } from './components/konva-tools-properties/konva-eraser-properties/konva-eraser-properties.component';
import { KonvaTextPropertiesComponent } from './components/konva-tools-properties/konva-text-properties/konva-text-properties.component';
import { KonvaRectanglePropertiesComponent } from './components/konva-tools-properties/konva-rectangle-properties/konva-rectangle-properties.component';
import { EditGameDataComponent } from './components/edit-game-data/edit-game-data.component';
import {AssetComponent} from './components/asset/asset.component';
import { UploadInputComponent } from './components/upload-input/upload-input.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import {AuthInterceptor} from './interceptors/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        RecursiveListComponent,
        CharacterSheetComponent,
        SignInComponent,
        SignUpComponent,
        CsHeaderComponent,
        CsAttributesComponent,
        CsSavingThrowsComponent,
        CsSkillsComponent,
        SignComponent,
        ErrorMessageComponent,
        KonvaBrushPropertiesComponent,
        KonvaEraserPropertiesComponent,
        KonvaTextPropertiesComponent,
        KonvaRectanglePropertiesComponent,
        EditGameDataComponent,
        AssetComponent,
        UploadInputComponent,
        DropdownComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
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
