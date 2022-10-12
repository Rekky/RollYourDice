import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbOnInitComponent } from './bb-on-init.component';

describe('BbOnInitComponent', () => {
  let component: BbOnInitComponent;
  let fixture: ComponentFixture<BbOnInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbOnInitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbOnInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
