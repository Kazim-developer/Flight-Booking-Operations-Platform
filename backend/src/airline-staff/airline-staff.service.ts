import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from 'generated/prisma/browser';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { CreateStaffDto } from './dto/create-staff.dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto/update-staff.dto';

@Injectable()
export class AirlineStaffService {
  constructor(private readonly prisma: PrismaService) {}

  private handleDatabaseError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Email already registered');
    }

    throw error;
  }

  async createStaff(airlineId: string, dto: CreateStaffDto) {
    const existingStaff = await this.prisma.aIRLINE_STAFF.findUnique({
      where: { email: dto.email },
    });

    if (existingStaff) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const staff = await this.prisma.aIRLINE_STAFF.create({
        data: {
          airlineId,
          email: dto.email,
          fullName: dto.fullName,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          airlineId: true,
          createdAt: true,
        },
      });

      return staff;
    } catch (error: unknown) {
      this.handleDatabaseError(error);
    }
  }

  async getStaff(airlineId: string) {
    return this.prisma.aIRLINE_STAFF.findMany({
      where: { airlineId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStaff(airlineId: string, staffId: string, dto: UpdateStaffDto) {
    const staff = await this.prisma.aIRLINE_STAFF.findFirst({
      where: {
        id: staffId,
        airlineId,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const data: Prisma.AIRLINE_STAFFUpdateInput = {};

    if (dto.email !== undefined && dto.email !== staff.email) {
      const existingStaff = await this.prisma.aIRLINE_STAFF.findUnique({
        where: { email: dto.email },
      });

      if (existingStaff) {
        throw new ConflictException('Email already registered');
      }

      data.email = dto.email;
    }

    if (dto.fullName !== undefined) {
      data.fullName = dto.fullName;
    }

    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    if (Object.keys(data).length === 0) {
      throw new ConflictException('No changes provided');
    }

    try {
      // Recheck airline ownership in the mutation itself.
      const result = await this.prisma.aIRLINE_STAFF.updateMany({
        where: {
          id: staffId,
          airlineId,
        },
        data,
      });

      if (result.count === 0) {
        throw new NotFoundException('Staff member not found');
      }

      return this.prisma.aIRLINE_STAFF.findFirstOrThrow({
        where: {
          id: staffId,
          airlineId,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          airlineId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  async deleteStaff(airlineId: string, staffId: string) {
    const result = await this.prisma.aIRLINE_STAFF.deleteMany({
      where: {
        id: staffId,
        airlineId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Staff member not found');
    }

    return {
      message: 'Staff member deleted successfully',
    };
  }
}
