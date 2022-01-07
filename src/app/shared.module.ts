import {NgModule} from '@angular/core';
import {EnumToArrayPipe} from './pipes/enum-to-array-pipe';
import {RecursiveListComponent} from './components/recursive-list/recursive-list.component';
import {MapComponent} from './components/map/map.component';
import {ErrorMessageComponent} from './components/error-message/error-message.component';
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {CharacterSheetComponent} from './components/character-sheet/character-sheet.component';
import {CsHeaderComponent} from './components/character-sheet/cs-header/cs-header.component';
import {CsAttributesComponent} from './components/character-sheet/cs-attributes/cs-attributes.component';
import {CsSavingThrowsComponent} from './components/character-sheet/cs-saving-throws/cs-saving-throws.component';
import {CsSkillsComponent} from './components/character-sheet/cs-skills/cs-skills.component';
import {AssetComponent} from './components/asset/asset.component';
import {UploadInputComponent} from './components/upload-input/upload-input.component';

@NgModule({
    declarations: [
        EnumToArrayPipe,
        RecursiveListComponent,
        MapComponent,
        ErrorMessageComponent,
        DropdownComponent,
        CharacterSheetComponent,
        CsHeaderComponent,
        CsAttributesComponent,
        CsSavingThrowsComponent,
        CsSkillsComponent,
        AssetComponent,
        UploadInputComponent,
    ],
    imports: [],
    exports: [EnumToArrayPipe],
})

export class SharedModule { }
