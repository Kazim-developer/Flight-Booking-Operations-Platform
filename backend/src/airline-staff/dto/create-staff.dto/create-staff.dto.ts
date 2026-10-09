import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStaffDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
