import { IsString, IsNotEmpty, IsInt, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name!: string; // 👈 Agrega el "!" antes de los dos puntos

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsInt()
  @Min(1)
  deliveryTime!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  deliveryFee!: number;

  @IsBoolean()
  isOpen!: boolean;

  @IsBoolean()
  isFeatured!: boolean;


  @IsString()
  @IsNotEmpty() // 👈 Cambiado de @IsOptional() a @IsNotEmpty()
  image!: string; // 👈 Quitamos el "?"
}