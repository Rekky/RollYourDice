import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Asset, AssetType} from 'src/app/classes/Asset';
import {AssetService} from 'src/app/services/asset.service';

@Component({
    selector: 'upload-input',
    templateUrl: './upload-input.component.html',
    styleUrls: ['./upload-input.component.scss']
})
export class UploadInputComponent implements OnInit {

    @Input() maxFileSize: string = '3MB';
    @Output() files: EventEmitter<any> = new EventEmitter<any>();

    previewFiles: {file: File, reader: string}[] = [];
    AssetType = AssetType;
    uploadError: boolean = false;

    constructor(private imageService: AssetService) { }

    ngOnInit(): void {
    }

    toFormData<T>(): any {
        const formData = new FormData();
        this.previewFiles.forEach(file => {
            formData.append('file', file.file);
        });
        return formData;
    }

    onFilesChange(ev: any): void {
        if (ev.target.files && ev.target.files.length > 0) {
            const files = ev.target.files;
            Array.from(files).forEach((file: any) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.previewFiles.push({file: file, reader: reader.result as string});
                };
            });
            const filesToEmit = this.toFormData();
            this.files.emit(filesToEmit);
        }
    }

    removeFile(file: {file: File, reader: string}): void {
        this.previewFiles = this.previewFiles.filter(f => f.file !== file.file);
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
