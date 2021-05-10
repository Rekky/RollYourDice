import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngameNavbarComponent } from './ingame-navbar.component';

describe('IngameNavbarComponent', () => {
  let component: IngameNavbarComponent;
  let fixture: ComponentFixture<IngameNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngameNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngameNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
