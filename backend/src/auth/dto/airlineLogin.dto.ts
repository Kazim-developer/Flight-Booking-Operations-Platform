import { IsEmail, IsString, MinLength } from 'class-validator';

export class AirlineLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class AirlineStaffLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class AirlineLoginResponseDto {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  airlineName!: string;

  @IsString()
  iataCode!: string;
}
