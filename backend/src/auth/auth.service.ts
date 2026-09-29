import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import {
  TravelerLoginDto,
  TravelerLoginResponseDto,
} from './dto/travelerLogin.dto';
import {
  AirlineLoginDto,
  AirlineLoginResponseDto,
} from './dto/airlineLogin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async travelerLogin(
    dto: TravelerLoginDto,
  ): Promise<TravelerLoginResponseDto> {
    const traveler = await this.prisma.traveler.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!traveler) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      traveler.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: traveler.id,
      email: traveler.email,
      role: 'TRAVELER',
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      id: traveler.id,
      email: traveler.email,
      fullName: traveler.fullName,
      phone: traveler.phone,
    };
  }

  async airlineLogin(dto: AirlineLoginDto): Promise<AirlineLoginResponseDto> {
    const airline = await this.prisma.airline.findUnique({
      where: {
        contactEmail: dto.email,
      },
    });

    if (!airline) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      airline.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: airline.id,
      email: airline.contactEmail,
      role: 'AIRLINE',
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      id: airline.id,
      email: airline.contactEmail,
      name: airline.airlineName,
      iataCode: airline.iataCode,
    };
  }
}
