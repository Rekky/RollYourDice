import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbSwitchIntegerComponent } from './bb-switch-integer.component';

describe('BbSwitchIntegerComponent', () => {
  let component: BbSwitchIntegerComponent;
  let fixture: ComponentFixture<BbSwitchIntegerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbSwitchIntegerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbSwitchIntegerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
