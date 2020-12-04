import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecursiveListComponent } from './recursive-list.component';

describe('RecursiveListComponent', () => {
  let component: RecursiveListComponent;
  let fixture: ComponentFixture<RecursiveListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecursiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
