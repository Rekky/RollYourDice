import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
    selector: 'upload-input',
    templateUrl: './upload-input.component.html',
    styleUrls: ['./upload-input.component.scss']
})
export class UploadInputComponent implements OnInit {

    @Input() name: string = 'Upload Image (2MB max)';
    @Input() previewUploadImage: any = null;
    @Output() file: EventEmitter<any> = new EventEmitter<any>();
    uploadError: boolean = false;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
    }

    async coverImageChanged(ev: any): Promise<void> {
        const reader = new FileReader();
        if (ev.target.files && ev.target.files.length) {
            const [file] = ev.target.files;
            reader.readAsDataURL(file);

            reader.onload = () => {
                this.previewUploadImage = reader.result as string;
            };
        }

        try {
            this.uploadError = false;
            const file = ev.target.files[0];
            this.file.emit(file);
            // const response: any = await this.uploadFile(file);
            // console.log('coverImageChanged', response);
            // this.post.coverImage = response.image;
            // this.formPost.get('coverImage').setValue(response.image);
        } catch (e) {
            if (e.status === 500) {
                this.uploadError = true;
            }
        }
    }

    async uploadFile(file: any): Promise<void> {
        // build formData and send to api
        const formData = new FormData();
        formData.append('asset', file);
        return await this.apiService.uploadFile(formData);
    }

}
