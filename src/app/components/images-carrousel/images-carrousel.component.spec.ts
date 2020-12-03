import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagesCarrouselComponent } from './images-carrousel.component';

describe('ImagesCarrouselComponent', () => {
  let component: ImagesCarrouselComponent;
  let fixture: ComponentFixture<ImagesCarrouselComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesCarrouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
