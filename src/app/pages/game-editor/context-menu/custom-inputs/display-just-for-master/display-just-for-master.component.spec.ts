import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayJustForMasterComponent } from './display-just-for-master.component';

describe('DisplayJustForMasterComponent', () => {
  let component: DisplayJustForMasterComponent;
  let fixture: ComponentFixture<DisplayJustForMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayJustForMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayJustForMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
