import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListCardComponent } from './chat-list-card.component';

describe('ChatListCardComponent', () => {
  let component: ChatListCardComponent;
  let fixture: ComponentFixture<ChatListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
