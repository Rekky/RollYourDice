import { Component, OnInit } from '@angular/core';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Router} from '@angular/router';
import {ImageService} from '../../services/image.service';

class ImageSnippet {
    pending: boolean = false;
    status: string = 'init';
    constructor(public src: string, public file: File) {}
}
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    selectedFile: ImageSnippet;

    constructor(private userInteractor: UserInteractor,
                private router: Router,
                private imageService: ImageService) {
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.userInteractor.logout();
    }

    play(): void {
        this.router.navigate(['./sign']);
    }

    uploadImageForm(): void {
        console.log('deku');
    }

    private onSuccess(): void {
        this.selectedFile.pending = false;
        this.selectedFile.status = 'ok';
    }

    private onError(): void {
        this.selectedFile.pending = false;
        this.selectedFile.status = 'fail';
        this.selectedFile.src = '';
    }

    processFile(imageInput: any): void {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {

            this.selectedFile = new ImageSnippet(event.target.result, file);

            this.imageService.uploadImage(this.selectedFile.file).subscribe(
                (res) => {
                    this.onSuccess();
                },
                (err) => {
                    this.onError();
                });
        });

        reader.readAsDataURL(file);
    }
}
