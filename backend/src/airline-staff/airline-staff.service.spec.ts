import { Test, TestingModule } from '@nestjs/testing';
import { AirlineStaffService } from './airline-staff.service';

describe('AirlineStaffService', () => {
  let service: AirlineStaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirlineStaffService],
    }).compile();

    service = module.get<AirlineStaffService>(AirlineStaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
