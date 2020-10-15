import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePropertyComponent } from './create-update-property.component';

describe('CreateUpdatePropertyComponent', () => {
  let component: CreateUpdatePropertyComponent;
  let fixture: ComponentFixture<CreateUpdatePropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdatePropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdatePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
