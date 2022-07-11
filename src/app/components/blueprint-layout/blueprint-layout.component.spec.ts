import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintLayoutComponent } from './blueprint-layout.component';

describe('BlueprintLayoutComponent', () => {
  let component: BlueprintLayoutComponent;
  let fixture: ComponentFixture<BlueprintLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlueprintLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueprintLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
