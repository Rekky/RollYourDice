import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardVerticalComponent } from './post-card-vertical.component';

describe('PostCardVerticalComponent', () => {
  let component: PostCardVerticalComponent;
  let fixture: ComponentFixture<PostCardVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
