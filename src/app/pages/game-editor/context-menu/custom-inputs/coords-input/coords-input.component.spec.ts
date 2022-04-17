import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordsInputComponent } from './coords-input.component';

describe('CoordsInputComponent', () => {
  let component: CoordsInputComponent;
  let fixture: ComponentFixture<CoordsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
