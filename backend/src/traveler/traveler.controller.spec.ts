import { Test, TestingModule } from '@nestjs/testing';
import { TravelerController } from './traveler.controller';

describe('TravelerController', () => {
  let controller: TravelerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelerController],
    }).compile();

    controller = module.get<TravelerController>(TravelerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
