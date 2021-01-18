import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsroomComponent } from './newsroom.component';

describe('NewsroomComponent', () => {
  let component: NewsroomComponent;
  let fixture: ComponentFixture<NewsroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
