import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsListToolsComponent } from './objects-list-tools.component';

describe('ObjectsListToolsComponent', () => {
  let component: ObjectsListToolsComponent;
  let fixture: ComponentFixture<ObjectsListToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectsListToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectsListToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
