import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AirlineAdminGuard } from '../auth/guards/airline-admin.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('flights')
@UseGuards(JwtAuthGuard)
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  @UseGuards(AirlineAdminGuard)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateFlightDto) {
    const user = req.user;

    if (user.userType !== 'AIRLINE_USER' || !user.airlineId) {
      throw new ForbiddenException('Airline administrator access required');
    }

    return this.flightsService.create(user.airlineId, dto);
  }

  @Get('available')
  findAvailable(@Req() req: AuthenticatedRequest) {
    const user = req.user;

    if (
      (user.userType !== 'AIRLINE_STAFF' && user.userType !== 'AIRLINE_USER') ||
      !user.airlineId
    ) {
      throw new ForbiddenException('Airline account access required');
    }

    return this.flightsService.findAvailable(user.airlineId);
  }
}
