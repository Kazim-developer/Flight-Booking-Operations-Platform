import { Module } from '@nestjs/common';
import { AirlineStaffController } from './airline-staff.controller';
import { AirlineStaffService } from './airline-staff.service';

@Module({
  controllers: [AirlineStaffController],
  providers: [AirlineStaffService]
})
export class AirlineStaffModule {}
