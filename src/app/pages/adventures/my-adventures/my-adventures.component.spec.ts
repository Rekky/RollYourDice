import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyAdventuresComponent } from './my-adventures.component';

describe('MyAdventuresComponent', () => {
  let component: MyAdventuresComponent;
  let fixture: ComponentFixture<MyAdventuresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAdventuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdventuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
