import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HideNewsDialogComponent } from './hide-news-dialog.component';

describe('HideNewsDialogComponent', () => {
  let component: HideNewsDialogComponent;
  let fixture: ComponentFixture<HideNewsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HideNewsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideNewsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
