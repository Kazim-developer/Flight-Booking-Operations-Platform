import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @Length(1, 100)
  flightId!: string;

  @IsString()
  @Length(2, 100)
  passengerFullName!: string;

  @IsEmail()
  @Length(5, 254)
  passengerEmail!: string;

  @IsString()
  @Length(5, 30)
  passengerPhone!: string;

  @IsInt()
  @Min(1)
  @Max(9)
  seatCount!: number;
}
