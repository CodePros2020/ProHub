import { TestBed } from '@angular/core/testing';

import { ChatMessagesService } from './chat-messages.service';

describe('ChatMessagesService', () => {
  let service: ChatMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
