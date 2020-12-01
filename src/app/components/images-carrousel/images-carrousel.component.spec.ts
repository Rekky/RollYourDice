import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCarrouselComponent } from './images-carrousel.component';

describe('ImagesCarrouselComponent', () => {
  let component: ImagesCarrouselComponent;
  let fixture: ComponentFixture<ImagesCarrouselComponent>;

  beforeEach(async(() => {
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
