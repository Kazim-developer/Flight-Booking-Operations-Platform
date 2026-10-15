import { Type } from 'class-transformer';
import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateTravelerBookingDto {
  @IsString()
  @MinLength(1)
  flightId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9)
  seatCount!: number;
}
