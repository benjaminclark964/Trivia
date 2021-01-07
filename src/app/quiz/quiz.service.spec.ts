import { TestBed } from '@angular/core/testing';

import { QuizService } from './quiz.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ HttpClient, HttpHandler ]
    });
    service = TestBed.inject(QuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
