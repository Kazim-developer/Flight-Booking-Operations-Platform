import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class SearchFlightsDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  origin?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  destination?: string;

  @IsOptional()
  @IsDateString()
  departureDate?: string;
}
