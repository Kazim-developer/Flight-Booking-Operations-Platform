import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { CreateTravelerBookingDto } from './dto/create-traveler-booking.dto';

@Injectable()
export class TravelerService {
  constructor(private readonly prisma: PrismaService) {}

  async searchFlights(dto: SearchFlightsDto) {
    const now = new Date();

    const departureFilter: {
      gt: Date;
      lt?: Date;
    } = { gt: now };

    if (dto.departureDate) {
      const start = new Date(`${dto.departureDate}T00:00:00.000Z`);

      if (Number.isNaN(start.getTime())) {
        throw new BadRequestException('Invalid departure date');
      }

      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      if (end <= now) {
        throw new BadRequestException(
          'Departure date must be today or in the future',
        );
      }

      departureFilter.gt = start > now ? start : now;
      departureFilter.lt = end;
    }

    return this.prisma.flight.findMany({
      where: {
        status: 'SCHEDULED',
        departureAt: departureFilter,
        availableSeats: { gt: 0 },

        ...(dto.origin && {
          origin: {
            contains: dto.origin.trim(),
            mode: 'insensitive',
          },
        }),

        ...(dto.destination && {
          destination: {
            contains: dto.destination.trim(),
            mode: 'insensitive',
          },
        }),
      },
      select: {
        id: true,
        flightNumber: true,
        origin: true,
        destination: true,
        departureAt: true,
        arrivalAt: true,
        price: true,
        availableSeats: true,
        airline: {
          select: {
            airlineName: true,
            iataCode: true,
          },
        },
      },
      orderBy: { departureAt: 'asc' },
    });
  }

  async createBooking(travelerId: string, dto: CreateTravelerBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      const traveler = await tx.tRAVELER.findUnique({
        where: { id: travelerId },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      });

      if (!traveler) {
        throw new NotFoundException('Traveler profile not found');
      }

      const flight = await tx.flight.findUnique({
        where: { id: dto.flightId },
        select: {
          id: true,
          airlineId: true,
          flightNumber: true,
          price: true,
          status: true,
          departureAt: true,
        },
      });

      if (!flight) {
        throw new NotFoundException('Flight not found');
      }

      if (flight.status !== 'SCHEDULED' || flight.departureAt <= new Date()) {
        throw new BadRequestException(
          'This flight is no longer available for booking',
        );
      }

      // Atomically reserve seats to prevent overbooking.
      const reservation = await tx.flight.updateMany({
        where: {
          id: flight.id,
          status: 'SCHEDULED',
          departureAt: { gt: new Date() },
          availableSeats: { gte: dto.seatCount },
        },
        data: {
          availableSeats: { decrement: dto.seatCount },
        },
      });

      if (reservation.count !== 1) {
        throw new BadRequestException(
          'Not enough seats are available. Please search again.',
        );
      }

      return tx.booking.create({
        data: {
          airlineId: flight.airlineId,
          flightId: flight.id,
          travelerId: traveler.id,
          passengerFullName: traveler.fullName,
          passengerEmail: traveler.email,
          passengerPhone: traveler.phone,
          seatCount: dto.seatCount,
          totalPrice: flight.price * dto.seatCount,
          status: 'CONFIRMED',
        },
        include: {
          flight: {
            select: {
              flightNumber: true,
              origin: true,
              destination: true,
              departureAt: true,
              arrivalAt: true,
            },
          },
        },
      });
    });
  }

  async getMyBookings(travelerId: string) {
    return this.prisma.booking.findMany({
      where: { travelerId },
      include: {
        flight: {
          select: {
            flightNumber: true,
            origin: true,
            destination: true,
            departureAt: true,
            arrivalAt: true,
          },
        },
        airline: {
          select: {
            airlineName: true,
            iataCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
