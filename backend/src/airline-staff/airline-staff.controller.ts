import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AirlineAdminGuard } from '../auth/guards/airline-admin.guard';
import type { AirlineUserJwtPayload } from '../auth/strategies/jwt.strategy';

import { AirlineStaffService } from './airline-staff.service';
import { CreateStaffDto } from './dto/create-staff.dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto/update-staff.dto';

interface AuthenticatedRequest extends Request {
  user: AirlineUserJwtPayload;
}

@Controller('airline-staff')
@UseGuards(JwtAuthGuard, AirlineAdminGuard)
export class AirlineStaffController {
  constructor(private readonly airlineStaffService: AirlineStaffService) {}

  @Post()
  createStaff(@Req() req: AuthenticatedRequest, @Body() dto: CreateStaffDto) {
    return this.airlineStaffService.createStaff(req.user.airlineId, dto);
  }

  @Get()
  getStaff(@Req() req: AuthenticatedRequest) {
    return this.airlineStaffService.getStaff(req.user.airlineId);
  }

  @Patch(':id')
  updateStaff(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) staffId: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.airlineStaffService.updateStaff(
      req.user.airlineId,
      staffId,
      dto,
    );
  }

  @Delete(':id')
  deleteStaff(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) staffId: string,
  ) {
    return this.airlineStaffService.deleteStaff(req.user.airlineId, staffId);
  }
}
