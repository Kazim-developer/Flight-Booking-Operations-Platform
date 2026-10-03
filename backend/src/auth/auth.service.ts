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
  AirlineStaffLoginDto,
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
    const existingTraveler = await this.prisma.tRAVELER.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingTraveler) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const traveler = await this.prisma.tRAVELER.create({
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
    const existingAdmin = await this.prisma.aIRLINE_USER.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingAdmin) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const result = await this.prisma.$transaction(async (tx) => {
      const airline = await tx.aIRLINE.create({
        data: {
          airlineName: dto.name,
          contactEmail: dto.email,
          iataCode: dto.iataCode,
        },
      });

      const admin = await tx.aIRLINE_USER.create({
        data: {
          airlineId: airline.id,
          email: dto.email,
          passwordHash,
          role: 'ADMIN',
        },
      });

      return {
        airline,
        admin,
      };
    });

    return {
      id: result.admin.id,
      airlineId: result.airline.id,
      airlineName: result.airline.airlineName,
      email: result.admin.email,
      role: result.admin.role,
      iataCode: result.airline.iataCode,
    };
  }

  async travelerLogin(
    dto: TravelerLoginDto,
  ): Promise<TravelerLoginResponseDto> {
    const traveler = await this.prisma.tRAVELER.findUnique({
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
    const airlineUser = await this.prisma.aIRLINE_USER.findUnique({
      where: {
        email: dto.email,
      },
      include: {
        airline: true,
      },
    });

    if (!airlineUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      airlineUser.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: airlineUser.id,
      accountType: 'AIRLINE_USER',
      role: airlineUser.role,
      airlineId: airlineUser.airlineId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      id: airlineUser.id,
      email: airlineUser.email,
      airlineName: airlineUser.airline.airlineName,
      iataCode: airlineUser.airline.iataCode,
    };
  }

  async airlineStaffLogin(dto: AirlineStaffLoginDto) {
    const staff = await this.prisma.aIRLINE_STAFF.findUnique({
      where: {
        email: dto.email,
      },
      include: {
        airline: true,
      },
    });

    if (!staff) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      staff.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: staff.id,
      accountType: 'AIRLINE_STAFF',
      role: staff.role,
      airlineId: staff.airlineId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }
}
