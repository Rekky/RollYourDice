import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AssetType} from 'src/app/classes/AssetModel';
import {AssetService} from 'src/app/services/asset.service';
import {Form} from '@angular/forms';

@Component({
    selector: 'upload-input',
    templateUrl: './upload-input.component.html',
    styleUrls: ['./upload-input.component.scss']
})
export class UploadInputComponent implements OnInit {

    @Input() multiple: boolean = false;
    @Input() maxFilesLimit: number = 3;
    @Input() maxFileSize: number = 2000000;
    @Output() files: EventEmitter<FormData> = new EventEmitter<FormData>();
    @Output() previewOutput: EventEmitter<any> = new EventEmitter<any>();

    previewFiles: {file: any, reader: string}[] = [];
    AssetType = AssetType;
    uploadError: {active: boolean; message: string} = {active: false, message: ''};

    constructor(private imageService: AssetService) { }

    ngOnInit(): void {
    }

    toFormData<T>(param: {file: any, reader: string}[]): FormData {
        const formData = new FormData();
        param.forEach(file => {
            formData.append('file', file.file);
        });
        return formData;
    }

    onFilesChange(ev: any): void {
        // reset error
        this.uploadError.active = false;

        // check max files limit
        if (ev.target.files.length > this.maxFilesLimit) {
            this.uploadError.active = true;
            this.uploadError.message = 'You can only upload ' + this.maxFilesLimit + ' files';
            return;
        }
        if (ev.target.files && ev.target.files.length > 0) {
            const files = ev.target.files;
            Array.from(files).forEach((file: any) => {

                // check max file size
                if (file.size > this.maxFileSize) {
                    this.uploadError.active = true;
                    this.uploadError.message = 'File size is too big';
                    return;
                }

                // make preview of file
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    if (this.multiple) {
                        this.previewFiles.push({file: file, reader: reader.result as string});
                    } else {
                        this.previewFiles[0] = {file: file, reader: reader.result as string};
                    }
                };
                reader.onloadend = () => {
                    // when all files are loaded, emit them
                    if (this.previewFiles.length === files.length) {
                        const filesToEmit: FormData = this.toFormData(this.previewFiles);
                        this.previewOutput.emit(this.previewFiles[0]);
                        this.files.emit(filesToEmit);
                    }
                };
            });
        }
    }

    removeFile(file: {file: File, reader: string}): void {
        this.previewFiles = this.previewFiles.filter(f => f.file !== file.file);
        if (this.previewFiles.length <= 0) {
            this.previewOutput.emit(null);
        }
    }

    getFileType(file: any): any {
        return file.type.split('/')[0];
    }

    formatBytes(bytes, decimals = 2): string {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

}
