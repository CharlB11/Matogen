import { TestBed } from '@angular/core/testing';

import { ProductMessageService } from './product-message.service';

describe('ProductMessageService', () => {
  let service: ProductMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
