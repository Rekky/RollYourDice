import { Component, OnInit } from '@angular/core';
import {UserInteractor} from '../../interactors/UserInteractor';
import {Router} from '@angular/router';
import {ImageService} from '../../services/image.service';
import {Post} from '../../classes/web/Post';
import {ApiService} from '../../services/api.service';
declare const particlesJS: any;

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

        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 55,
                    "density": {
                        "enable": true,
                        "value_area": 789.1476416322727
                    }
                },
                "color": {
                    "value": "#fff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 5,
                    "random": false,
                    "anim": {
                        "enable": true,
                        "speed": 0.2,
                        "opacity_min": 0,
                        "sync": false
                    }
                },
                "size": {
                    "value": 2,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 4,
                        "size_min": 0,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 0.2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 83.91608391608392,
                        "size": 1,
                        "duration": 3,
                        "opacity": 1,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
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
