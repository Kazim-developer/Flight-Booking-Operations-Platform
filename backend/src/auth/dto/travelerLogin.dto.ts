import { IsEmail, IsString, MinLength } from 'class-validator';

export class TravelerLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class TravelerLoginResponseDto {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  accessToken!: string;
}
