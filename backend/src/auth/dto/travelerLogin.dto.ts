import { IsEmail, IsString, MinLength } from 'class-validator';

export class TravelerLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class TravelerLoginResponseDto {
  id!: string;
  email!: string;
  fullName!: string;
  phone!: string;
  accessToken!: string;
}
