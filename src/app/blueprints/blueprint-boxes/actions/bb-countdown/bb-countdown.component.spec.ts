import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbCountdownComponent } from './bb-countdown.component';

describe('BbCountdownComponent', () => {
  let component: BbCountdownComponent;
  let fixture: ComponentFixture<BbCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbCountdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
