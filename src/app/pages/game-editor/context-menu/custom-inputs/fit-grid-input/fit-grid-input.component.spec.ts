import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitGridInputComponent } from './fit-grid-input.component';

describe('FitGridInputComponent', () => {
  let component: FitGridInputComponent;
  let fixture: ComponentFixture<FitGridInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitGridInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FitGridInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
