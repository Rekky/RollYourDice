import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersGameComponent } from './players-game.component';

describe('PlayersGameComponent', () => {
  let component: PlayersGameComponent;
  let fixture: ComponentFixture<PlayersGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
