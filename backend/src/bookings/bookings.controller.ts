import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('airline/staff/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  private getStaff(req: AuthenticatedRequest) {
    const user = req.user;

    if (user.userType !== 'AIRLINE_STAFF' || !user.airlineId) {
      throw new ForbiddenException(
        'Only airline staff can use this booking endpoint',
      );
    }

    return {
      airlineId: user.airlineId,
      staffId: user.sub,
    };
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBookingDto) {
    const { airlineId, staffId } = this.getStaff(req);

    return this.bookingsService.create(airlineId, staffId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { airlineId } = this.getStaff(req);

    return this.bookingsService.findAll(airlineId);
  }
}
