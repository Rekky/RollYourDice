import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbWrappingComponent } from './bb-wrapping.component';

describe('BbWrappingComponent', () => {
  let component: BbWrappingComponent;
  let fixture: ComponentFixture<BbWrappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbWrappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbWrappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
