import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  TravelerSignupDto,
  TravelerSignupResponseDto,
} from './dto/travelerSignup.dto';
import {
  AirlineSignupDto,
  AirlineSignupResponseDto,
} from './dto/airlineSignup.dto';
import { TravelerLoginDto } from './dto/travelerLogin.dto';
import {
  AirlineLoginDto,
  AirlineLoginResponseDto,
  AirlineStaffLoginDto,
} from './dto/airlineLogin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  AirlineStaffJwtPayload,
  AirlineUserJwtPayload,
  TravelerJwtPayload,
} from './strategies/jwt.strategy';
import type { Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: AirlineUserJwtPayload | TravelerJwtPayload | AirlineStaffJwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    const user = req.user;

    return {
      id: user.sub,
      email: user.email,
      userType: user.userType,
      role: user.role,
      airlineId: user.userType === 'TRAVELER' ? undefined : user.airlineId,
    };
  }

  @Post('traveler-signup')
  travelerSignup(
    @Body() travelerInputData: TravelerSignupDto,
  ): Promise<TravelerSignupResponseDto> {
    return this.authService.travelerSignup(travelerInputData);
  }

  @Post('airline-signup')
  airlineSignup(
    @Body() airlineInputData: AirlineSignupDto,
  ): Promise<AirlineSignupResponseDto> {
    return this.authService.airlineSignup(airlineInputData);
  }

  @Post('traveler-login')
  async travelerLogin(
    @Body() travelerInputData: TravelerLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.travelerLogin(travelerInputData);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      id: result.id,
      email: result.email,
    };
  }

  @Post('airline-login')
  async airlineLogin(
    @Body() airlineInputData: AirlineLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AirlineLoginResponseDto> {
    const result = await this.authService.airlineLogin(airlineInputData);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      id: result.id,
      email: result.email,
      airlineName: result.airlineName,
      iataCode: result.iataCode,
    };
  }

  @Post('airline-staff-login')
  async airlineStaffLogin(
    @Body() dto: AirlineStaffLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.airlineStaffLogin(dto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      success: true,
    };
  }
}
