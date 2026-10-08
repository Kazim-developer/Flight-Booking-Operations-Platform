import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { CreateStaffDto } from './dto/create-staff.dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto/update-staff.dto';

@Injectable()
export class AirlineStaffService {
  constructor(private readonly prisma: PrismaService) {}

  async createStaff(airlineId: string, dto: CreateStaffDto) {
    const existingStaff = await this.prisma.aIRLINE_STAFF.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingStaff) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const staff = await this.prisma.aIRLINE_STAFF.create({
      data: {
        airlineId,
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
      },
    });

    return {
      id: staff.id,
      email: staff.email,
      fullName: staff.fullName,
      role: staff.role,
      airlineId: staff.airlineId,
    };
  }

  async getStaff(airlineId: string) {
    return this.prisma.aIRLINE_STAFF.findMany({
      where: {
        airlineId,
      },
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
    const staff = await this.prisma.aIRLINE_STAFF.findUnique({
      where: {
        id: staffId,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    if (staff.airlineId !== airlineId) {
      throw new ForbiddenException(
        'You cannot modify staff from another airline',
      );
    }

    if (dto.email && dto.email !== staff.email) {
      const existingStaff = await this.prisma.aIRLINE_STAFF.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (existingStaff) {
        throw new ConflictException('Email already registered');
      }
    }

    const data: {
      email?: string;
      fullName?: string;
      passwordHash?: string;
    } = {};

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.fullName !== undefined) {
      data.fullName = dto.fullName;
    }

    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    const updatedStaff = await this.prisma.aIRLINE_STAFF.update({
      where: {
        id: staffId,
      },
      data,
    });

    return {
      id: updatedStaff.id,
      email: updatedStaff.email,
      fullName: updatedStaff.fullName,
      role: updatedStaff.role,
      airlineId: updatedStaff.airlineId,
    };
  }

  async deleteStaff(airlineId: string, staffId: string) {
    const staff = await this.prisma.aIRLINE_STAFF.findUnique({
      where: {
        id: staffId,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    if (staff.airlineId !== airlineId) {
      throw new ForbiddenException(
        'You cannot delete staff from another airline',
      );
    }

    await this.prisma.aIRLINE_STAFF.delete({
      where: {
        id: staffId,
      },
    });

    return {
      message: 'Staff member deleted successfully',
    };
  }
}
