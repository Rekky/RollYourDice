import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorCirclesPickerComponent } from './color-circles-picker.component';

describe('ColorCirclesPickerComponent', () => {
  let component: ColorCirclesPickerComponent;
  let fixture: ComponentFixture<ColorCirclesPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorCirclesPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorCirclesPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
