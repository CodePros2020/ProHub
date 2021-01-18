import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUnitComponent } from './add-edit-unit.component';

describe('AddEditUnitComponent', () => {
  let component: AddEditUnitComponent;
  let fixture: ComponentFixture<AddEditUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
