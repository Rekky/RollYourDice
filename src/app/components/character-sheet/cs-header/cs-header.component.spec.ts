import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CsHeaderComponent } from './cs-header.component';

describe('CsHeaderComponent', () => {
  let component: CsHeaderComponent;
  let fixture: ComponentFixture<CsHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
