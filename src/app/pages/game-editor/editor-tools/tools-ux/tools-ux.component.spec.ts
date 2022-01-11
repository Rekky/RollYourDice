import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsUxComponent } from './tools-ux.component';

describe('ToolsUxComponent', () => {
  let component: ToolsUxComponent;
  let fixture: ComponentFixture<ToolsUxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsUxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsUxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
