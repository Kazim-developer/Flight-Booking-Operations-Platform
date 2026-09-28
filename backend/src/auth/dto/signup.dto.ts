import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
