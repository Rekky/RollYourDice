import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorToolsComponent } from './editor-tools.component';

describe('EditorToolsComponent', () => {
  let component: EditorToolsComponent;
  let fixture: ComponentFixture<EditorToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
