import { IsEmail, IsString } from 'class-validator';

export class TravelerLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
