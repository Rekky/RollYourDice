import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-images-carrousel',
    templateUrl: './images-carrousel.component.html',
    styleUrls: ['./images-carrousel.component.scss']
})
export class ImagesCarrouselComponent implements OnInit, OnChanges {

    @Input() images: string[];
    @Input() disableArrows: boolean;
    @Input() selectedImageIndex: number = 0;
    @Output() selectedImageIndexChange: EventEmitter<number> = new EventEmitter<number>();

    previousImageIndex: number = 1;
    nextImageIndex: number = 999999;
    disableChangeImage: boolean = false;

    constructor() { }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('images')) {
            console.log('changes =', changes);
            this.setNextImageIndex();
            this.setPreviousImageIndex();
        }
    }

    setPreviousImageIndex(): void {
        if (this.selectedImageIndex === this.images.length - 1) {
            this.previousImageIndex = 999999;
        }
        else if (this.selectedImageIndex === 999999) {
            this.previousImageIndex = 0;
        }
        else if (this.selectedImageIndex < this.images.length - 1) {
            this.previousImageIndex++;
        }
    }

    getPreviousImageIndexToLoad(): number {
        if (this.previousImageIndex === this.images.length - 1) {
            return 999999;
        }
        else if (this.previousImageIndex === 999999) {
            return 0;
        }
        else if (this.previousImageIndex < this.images.length - 1) {
            return this.previousImageIndex + 1;
        }
    }

    setNextImageIndex(): void {
        if (this.selectedImageIndex === 0) {
            this.nextImageIndex = 999999;
        }
        else if (this.selectedImageIndex === 999999) {
            this.nextImageIndex = this.images.length - 1;
        }
        else if (this.selectedImageIndex <= this.images.length - 1) {
            this.nextImageIndex = this.selectedImageIndex - 1;
        }
    }

    getNextImageIndexToLoad(): number {
        if (this.nextImageIndex === 0) {
            return 999999;
        }
        else if (this.nextImageIndex === 999999) {
            return this.images.length - 1;
        }
        else if (this.nextImageIndex <= this.images.length - 1) {
            return this.nextImageIndex - 1;
        }
    }

    previousImage(): void {
        if (!this.disableChangeImage) {
            this.disableChangeImage = true;

            const previousCard = document.getElementsByClassName('previous-card')[0];
            const currentCard = document.getElementsByClassName('current-card')[0];
            const nextCard = document.getElementsByClassName('next-card')[0];
            const hiddenCard = document.getElementsByClassName('hidden-card')[0];

            const imgToChange = hiddenCard.getElementsByTagName('img')[0] as HTMLImageElement;
            imgToChange.src = this.getPreviousImageIndexToLoad() === 999999 ? '' : this.images[this.getPreviousImageIndexToLoad()];

            previousCard.classList.remove('previous-card');
            previousCard.classList.add('hidden-card');
            currentCard.classList.remove('current-card');
            currentCard.classList.add('previous-card');
            nextCard.classList.remove('next-card');
            nextCard.classList.add('current-card');
            hiddenCard.classList.remove('hidden-card');
            hiddenCard.classList.add('next-card');

            if (this.selectedImageIndex === 999999) {
                currentCard.classList.remove('add-image');
            }

            if (this.selectedImageIndex === this.images.length - 1) {
                this.selectedImageIndex = 999999;
            }
            else if (this.selectedImageIndex === 999999) {
                this.selectedImageIndex = 0;
            }
            else if (this.selectedImageIndex < this.images.length - 1) {
                this.selectedImageIndex++;
            }

            if (this.selectedImageIndex === 999999) {
                nextCard.classList.add('add-image');
            }

            this.selectedImageIndexChange.emit(this.selectedImageIndex);
            this.setNextImageIndex();
            this.setPreviousImageIndex();
            this.disableChangeImage = false;

            setTimeout(() => {
            }, 1000);
        }
    }

    nextImage(): void {
        if (!this.disableChangeImage) {
            this.disableChangeImage = true;

            const previousCard = document.getElementsByClassName('previous-card')[0];
            const currentCard = document.getElementsByClassName('current-card')[0];
            const nextCard = document.getElementsByClassName('next-card')[0];
            const hiddenCard = document.getElementsByClassName('hidden-card')[0];

            const imgToChange = hiddenCard.getElementsByTagName('img')[0] as HTMLImageElement;
            imgToChange.src = this.getNextImageIndexToLoad() === 999999 ? '' : this.images[this.getNextImageIndexToLoad()];

            previousCard.classList.remove('previous-card');
            previousCard.classList.add('current-card');
            currentCard.classList.remove('current-card');
            currentCard.classList.add('next-card');
            nextCard.classList.remove('next-card');
            nextCard.classList.add('hidden-card');
            hiddenCard.classList.remove('hidden-card');
            hiddenCard.classList.add('previous-card');

            if (this.selectedImageIndex === 999999) {
                currentCard.classList.remove('add-image');
            }

            if (this.selectedImageIndex === 0) {
                this.selectedImageIndex = 999999;
            }
            else if (this.selectedImageIndex === 999999) {
                this.selectedImageIndex = this.images.length - 1;
            }
            else if (this.selectedImageIndex <= this.images.length - 1) {
                this.selectedImageIndex--;
            }

            if (this.selectedImageIndex === 999999) {
                previousCard.classList.add('add-image');
            }

            this.selectedImageIndexChange.emit(this.selectedImageIndex);
            this.setNextImageIndex();
            this.setPreviousImageIndex();
            this.disableChangeImage = false;
        }
    }

    rightImageThreeCards(): void {
        if (!this.disableChangeImage) {
            this.disableChangeImage = true;
            if (this.selectedImageIndex === 0) {
                this.selectedImageIndex++;
            } else if (this.selectedImageIndex === 1) {
                this.selectedImageIndex = 999999;
            } else {
                this.selectedImageIndex = 0;
            }
            this.selectedImageIndexChange.emit(this.selectedImageIndex);
            this.disableChangeImage = false;
        }
    }

    leftImageThreeCards(): void {
        if (!this.disableChangeImage) {
            this.disableChangeImage = true;
            if (this.selectedImageIndex === 0) {
                this.selectedImageIndex = 999999;
            } else if (this.selectedImageIndex === 999999) {
                this.selectedImageIndex = 1;
            } else {
                this.selectedImageIndex = 0;
            }
            this.selectedImageIndexChange.emit(this.selectedImageIndex);
            this.disableChangeImage = false;
        }
    }

    changeCard(): void {
        if (!this.disableChangeImage) {
            this.disableChangeImage = true;
            if (this.selectedImageIndex === 0) {
                this.selectedImageIndex = 999999;
            } else {
                this.selectedImageIndex = 0;
            }
            this.selectedImageIndexChange.emit(this.selectedImageIndex);
            this.disableChangeImage = false;
        }
    }
}
