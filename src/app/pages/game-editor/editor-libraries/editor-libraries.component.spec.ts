import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorLibrariesComponent } from './editor-libraries.component';

describe('EditorLibrariesComponent', () => {
  let component: EditorLibrariesComponent;
  let fixture: ComponentFixture<EditorLibrariesComponent>;

  beforeEach(waitForAsync(() => {
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
