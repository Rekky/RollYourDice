import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbForEachLoopComponent } from './bb-for-each-loop.component';

describe('BbForEachLoopComponent', () => {
  let component: BbForEachLoopComponent;
  let fixture: ComponentFixture<BbForEachLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbForEachLoopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbForEachLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
