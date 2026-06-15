import { IsString, IsNotEmpty, IsInt, IsNumber, IsBoolean, Min, IsArray, ValidateNested, Max } from 'class-validator';import { Type } from 'class-transformer';

// 🌟 Sub-DTO para validar cada horario individual enviado por el admin
export class OpeningHourDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @IsString()
  @IsNotEmpty()
  openTime!: string; // Validará cadenas como "11:30"

  @IsString()
  @IsNotEmpty()
  closeTime!: string; // Validará cadenas como "23:00"
}

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

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
  @IsNotEmpty()
  image!: string;

  // 🌟 NUEVO CAMPO: Arreglo de horarios validados jerárquicamente
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHourDto)
  openingHours!: OpeningHourDto[];
}