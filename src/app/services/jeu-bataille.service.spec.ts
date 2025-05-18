import { TestBed } from '@angular/core/testing';

import { JeuBatailleService } from './jeu-bataille.service';

describe('JeuBatailleService', () => {
  let service: JeuBatailleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JeuBatailleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
