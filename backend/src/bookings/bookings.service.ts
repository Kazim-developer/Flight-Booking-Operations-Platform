import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(airlineId: string, staffId: string, dto: CreateBookingDto) {
    if (
      !Number.isInteger(dto.seatCount) ||
      dto.seatCount < 1 ||
      dto.seatCount > 9
    ) {
      throw new BadRequestException('Seat count must be between 1 and 9');
    }

    return this.prisma.$transaction(async (tx) => {
      const flight = await tx.flight.findFirst({
        where: {
          id: dto.flightId,
          airlineId,
          status: 'SCHEDULED',
          departureAt: { gt: new Date() },
        },
      });

      if (!flight) {
        throw new NotFoundException(
          'Available flight not found for your airline',
        );
      }

      const seatUpdate = await tx.flight.updateMany({
        where: {
          id: flight.id,
          airlineId,
          status: 'SCHEDULED',
          departureAt: { gt: new Date() },
          availableSeats: { gte: dto.seatCount },
        },
        data: {
          availableSeats: { decrement: dto.seatCount },
        },
      });

      if (seatUpdate.count !== 1) {
        throw new ConflictException(
          'Not enough seats are available for this flight',
        );
      }

      const totalPrice = flight.price * dto.seatCount;

      return tx.booking.create({
        data: {
          airlineId,
          flightId: flight.id,
          bookedByStaffId: staffId,
          passengerFullName: dto.passengerFullName.trim(),
          passengerEmail: dto.passengerEmail.trim().toLowerCase(),
          passengerPhone: dto.passengerPhone.trim(),
          seatCount: dto.seatCount,
          totalPrice,
        },
        include: {
          flight: true,
        },
      });
    });
  }

  async findAll(airlineId: string) {
    return this.prisma.booking.findMany({
      where: { airlineId },
      include: {
        flight: true,
        bookedByStaff: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
