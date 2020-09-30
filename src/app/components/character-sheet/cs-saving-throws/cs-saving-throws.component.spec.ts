import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsSavingThrowsComponent } from './cs-saving-throws.component';

describe('CsSavingThrowsComponent', () => {
  let component: CsSavingThrowsComponent;
  let fixture: ComponentFixture<CsSavingThrowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsSavingThrowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsSavingThrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
