import { Component, OnInit } from '@angular/core';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Router} from '@angular/router';
import {ImageService} from '../../services/image.service';
import {Post} from '../../classes/web/Post';
import {ApiService} from '../../services/api.service';

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
    imageResponse: any;
    posts: Post[] = [];

    constructor(private userInteractor: UserInteractor,
                private router: Router,
                private imageService: ImageService,
                private apiService: ApiService
    ) {
    }

    async ngOnInit(): Promise<void> {
        const response = await this.apiService.getAllPosts(0, 3, '', '');
        this.posts = response.data;
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
}
