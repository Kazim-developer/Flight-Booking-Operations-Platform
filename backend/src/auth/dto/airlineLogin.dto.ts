import { IsEmail, IsString } from 'class-validator';

export class AirlineLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
