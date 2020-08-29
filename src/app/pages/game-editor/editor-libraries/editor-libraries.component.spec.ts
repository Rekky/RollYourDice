import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorLibrariesComponent } from './editor-libraries.component';

describe('EditorLibrariesComponent', () => {
  let component: EditorLibrariesComponent;
  let fixture: ComponentFixture<EditorLibrariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorLibrariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorLibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
