import { inject, TestBed } from '@angular/core/testing'

import { RunnerService } from './runner.service'

describe('RunnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RunnerService],
    })
  })

  it('should ...', inject([RunnerService], (service: RunnerService) => {
    expect(service).toBeTruthy()
  }))
})
