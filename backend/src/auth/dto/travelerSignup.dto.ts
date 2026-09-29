import { IsEmail, IsString, MinLength } from 'class-validator';

export class TravelerSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class TravelerSignupResponseDto {
  id!: string;
  email!: string;
  phone!: string;
  fullName!: string;
}
