import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusToolsComponent } from './game-status-tools.component';

describe('GameStatusToolsComponent', () => {
  let component: GameStatusToolsComponent;
  let fixture: ComponentFixture<GameStatusToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStatusToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatusToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
