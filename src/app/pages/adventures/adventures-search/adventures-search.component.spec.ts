import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdventuresSearchComponent } from './adventures-search.component';

describe('AdventuresSearchComponent', () => {
  let component: AdventuresSearchComponent;
  let fixture: ComponentFixture<AdventuresSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdventuresSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventuresSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
