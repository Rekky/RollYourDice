import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeColorComponent } from './stroke-color.component';

describe('StrokeColorComponent', () => {
  let component: StrokeColorComponent;
  let fixture: ComponentFixture<StrokeColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrokeColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrokeColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
