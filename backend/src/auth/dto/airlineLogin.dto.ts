import { IsEmail, IsString, MinLength } from 'class-validator';

export class AirlineLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class AirlineLoginResponseDto {
  id!: string;
  email!: string;
  name!: string;
  iataCode!: string;
  accessToken!: string;
}
