import { IsEmail, IsString, MinLength } from 'class-validator';

export class AirlineSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  iataCode!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class AirlineSignupResponseDto {
  id!: string;
  email!: string;
  iataCode!: string;
  name!: string;
}
