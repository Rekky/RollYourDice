import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CsAttributesComponent } from './cs-attributes.component';

describe('CsAttributesComponent', () => {
  let component: CsAttributesComponent;
  let fixture: ComponentFixture<CsAttributesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CsAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
