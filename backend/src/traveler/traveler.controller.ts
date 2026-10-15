import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TravelerService } from './traveler.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { CreateTravelerBookingDto } from './dto/create-traveler-booking.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    userType: string;
  };
}

@Controller('traveler')
@UseGuards(JwtAuthGuard)
export class TravelerController {
  constructor(private readonly travelerService: TravelerService) {}

  private getTravelerId(req: AuthenticatedRequest): string {
    if (req.user?.userType !== 'TRAVELER' || !req.user.sub) {
      throw new ForbiddenException('Only travelers can access this resource');
    }

    return req.user.sub;
  }

  @Get('flights')
  searchFlights(@Query() dto: SearchFlightsDto) {
    return this.travelerService.searchFlights(dto);
  }

  @Post('bookings')
  createBooking(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTravelerBookingDto,
  ) {
    const travelerId = this.getTravelerId(req);

    return this.travelerService.createBooking(travelerId, dto);
  }

  @Get('bookings')
  getMyBookings(@Req() req: AuthenticatedRequest) {
    const travelerId = this.getTravelerId(req);

    return this.travelerService.getMyBookings(travelerId);
  }
}
