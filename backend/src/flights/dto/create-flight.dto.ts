import {
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateFlightDto {
  @IsString()
  @Length(2, 20)
  flightNumber!: string;

  @IsString()
  @Length(3, 100)
  origin!: string;

  @IsString()
  @Length(3, 100)
  destination!: string;

  @IsDateString()
  departureAt!: string;

  @IsDateString()
  arrivalAt!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  totalSeats!: number;
}
