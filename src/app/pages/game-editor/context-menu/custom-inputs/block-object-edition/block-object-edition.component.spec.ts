import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockObjectEditionComponent } from './block-object-edition.component';

describe('BlockObjectEditionComponent', () => {
  let component: BlockObjectEditionComponent;
  let fixture: ComponentFixture<BlockObjectEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockObjectEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockObjectEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
