import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  TravelerSignupDto,
  TravelerSignupResponseDto,
} from './dto/travelerSignup.dto';
import {
  AirlineSignupDto,
  AirlineSignupResponseDto,
} from './dto/airlineSignup.dto';
import { TravelerLoginDto } from './dto/travelerLogin.dto';
import { AirlineLoginDto } from './dto/airlineLogin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async travelerSignup(
    dto: TravelerSignupDto,
  ): Promise<TravelerSignupResponseDto> {
    const existingUser = await this.prisma.traveler.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const traveler = await this.prisma.traveler.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
      },
    });

    return {
      id: traveler.id,
      email: traveler.email,
      fullName: traveler.fullName,
      phone: traveler.phone,
    };
  }

  async airlineSignup(
    dto: AirlineSignupDto,
  ): Promise<AirlineSignupResponseDto> {
    const existingAirline = await this.prisma.airline.findUnique({
      where: {
        contactEmail: dto.email,
      },
    });

    if (existingAirline) {
      throw new ConflictException('Airline already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const airline = await this.prisma.airline.create({
      data: {
        contactEmail: dto.email,
        airlineName: dto.name,
        iataCode: dto.iataCode,
        passwordHash,
      },
    });

    return {
      id: airline.id,
      email: airline.contactEmail,
      name: airline.airlineName,
      iataCode: airline.iataCode,
    };
  }

  async travelerLogin(dto: TravelerLoginDto) {}

  async airlineLogin(dto: AirlineLoginDto) {}
}
