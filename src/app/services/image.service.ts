import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

    constructor(private httpService: HttpService) {}


    public uploadImage(image: File): Observable<Response> {
        const formData = new FormData();

        formData.append('image', image);

        return this.httpService.post('/image/upload', formData);
    }
}

