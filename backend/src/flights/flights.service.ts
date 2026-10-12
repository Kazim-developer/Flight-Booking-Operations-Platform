import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightDto } from './dto/create-flight.dto';

@Injectable()
export class FlightsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(airlineId: string, dto: CreateFlightDto) {
    const departureAt = new Date(dto.departureAt);
    const arrivalAt = new Date(dto.arrivalAt);

    if (departureAt <= new Date()) {
      throw new BadRequestException('Departure must be in the future');
    }

    if (arrivalAt <= departureAt) {
      throw new BadRequestException('Arrival must be after departure');
    }

    if (
      dto.origin.trim().toLowerCase() === dto.destination.trim().toLowerCase()
    ) {
      throw new BadRequestException('Origin and destination must be different');
    }

    return this.prisma.flight.create({
      data: {
        airlineId,
        flightNumber: dto.flightNumber.trim().toUpperCase(),
        origin: dto.origin.trim(),
        destination: dto.destination.trim(),
        departureAt,
        arrivalAt,
        price: dto.price,
        totalSeats: dto.totalSeats,
        availableSeats: dto.totalSeats,
      },
    });
  }

  async findAvailable(airlineId: string) {
    return this.prisma.flight.findMany({
      where: {
        airlineId,
        status: 'SCHEDULED',
        departureAt: { gt: new Date() },
        availableSeats: { gt: 0 },
      },
      orderBy: { departureAt: 'asc' },
    });
  }
}
