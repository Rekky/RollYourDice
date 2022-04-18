import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeInputComponent } from './stroke-input.component';

describe('StrokeInputComponent', () => {
  let component: StrokeInputComponent;
  let fixture: ComponentFixture<StrokeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrokeInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrokeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
