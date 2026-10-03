import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class AirlineSignupDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  iataCode!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class AirlineSignupResponseDto {
  @IsString()
  id!: string;

  @IsString()
  airlineId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  iataCode!: string;

  @IsString()
  airlineName!: string;

  @IsString()
  role!: string;
}
