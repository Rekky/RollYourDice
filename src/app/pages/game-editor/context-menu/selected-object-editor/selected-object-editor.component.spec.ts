import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedObjectEditorComponent } from './selected-object-editor.component';

describe('SelectedObjectEditorComponent', () => {
  let component: SelectedObjectEditorComponent;
  let fixture: ComponentFixture<SelectedObjectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedObjectEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedObjectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
