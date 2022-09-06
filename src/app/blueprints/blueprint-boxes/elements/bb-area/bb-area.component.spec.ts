import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbAreaComponent } from './bb-area.component';

describe('BbAreaComponent', () => {
  let component: BbAreaComponent;
  let fixture: ComponentFixture<BbAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BbAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
