import {NgModule} from '@angular/core';
import {EnumToArrayPipe} from './pipes/enum-to-array-pipe';
import {RecursiveListComponent} from './components/recursive-list/recursive-list.component';
import {NotificationComponent} from './components/notification/notification.component';
import {CharacterSheetComponent} from './components/character-sheet/character-sheet.component';
import {CsHeaderComponent} from './components/character-sheet/cs-header/cs-header.component';
import {CsAttributesComponent} from './components/character-sheet/cs-attributes/cs-attributes.component';
import {CsSavingThrowsComponent} from './components/character-sheet/cs-saving-throws/cs-saving-throws.component';
import {CsSkillsComponent} from './components/character-sheet/cs-skills/cs-skills.component';
import {AssetComponent} from './components/asset/asset.component';
import {UploadInputComponent} from './components/upload-input/upload-input.component';
import {EditGameDataComponent} from './components/edit-game-data/edit-game-data.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {LauncherRoutingModule} from './pages/launcher/launcher-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {SafePipe} from './pipes/safe-pipe';
import { SearchGameComponent } from './components/search-game/search-game.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ModalCustomComponent } from './components/modal-custom/modal-custom.component';

@NgModule({
    declarations: [
        EnumToArrayPipe,
        SafePipe,
        RecursiveListComponent,
        NotificationComponent,
        CharacterSheetComponent,
        CsHeaderComponent,
        CsAttributesComponent,
        CsSavingThrowsComponent,
        CsSkillsComponent,
        AssetComponent,
        UploadInputComponent,
        EditGameDataComponent,
        SearchGameComponent,
        UserListComponent,
        ModalCustomComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        LauncherRoutingModule,
        ReactiveFormsModule,
        MatDialogModule,
    ],
    exports: [
        EnumToArrayPipe,
        SafePipe,
        RecursiveListComponent,
        NotificationComponent,
        CharacterSheetComponent,
        CsHeaderComponent,
        CsAttributesComponent,
        CsSavingThrowsComponent,
        CsSkillsComponent,
        AssetComponent,
        UploadInputComponent,
        EditGameDataComponent,
        ModalCustomComponent
    ],
})

export class SharedModule { }
