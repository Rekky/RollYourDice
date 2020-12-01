import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGameDataComponent } from './edit-game-data.component';

describe('EditGameDataComponent', () => {
  let component: EditGameDataComponent;
  let fixture: ComponentFixture<EditGameDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGameDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGameDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
