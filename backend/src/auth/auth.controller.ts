import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  travelerLogin(
    @Body() travelerInputData: TravelerLoginDto,
  ): Promise<TravelerLoginResponseDto> {
    return this.authService.travelerLogin(travelerInputData);
  }

  @Post('airline-login')
  airlineLogin(
    @Body() airlineInputData: AirlineLoginDto,
  ): Promise<AirlineLoginResponseDto> {
    return this.authService.airlineLogin(airlineInputData);
  }
}
