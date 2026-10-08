import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateStaffDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
