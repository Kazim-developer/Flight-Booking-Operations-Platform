import { Test, TestingModule } from '@nestjs/testing';
import { AirlineStaffController } from './airline-staff.controller';

describe('AirlineStaffController', () => {
  let controller: AirlineStaffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlineStaffController],
    }).compile();

    controller = module.get<AirlineStaffController>(AirlineStaffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
