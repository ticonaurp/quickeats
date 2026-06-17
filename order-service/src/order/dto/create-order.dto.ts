import { IsNotEmpty, IsString, IsInt, Min, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 🍕 Validamos de forma estricta la estructura de cada plato dentro del carrito
export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  public productId!: string;

  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public price!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'La cantidad mínima para este producto es 1.' })
  public quantity!: number;
}

// 📦 Validamos el cuerpo principal de la orden
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  public userId!: string; 

  @IsNotEmpty()
  @IsString()
  public restaurantId!: string;

  @IsNotEmpty()
  @IsString()
  public restaurantName!: string;

  @IsNotEmpty()
  @IsString()
  public address!: string;

  @IsOptional()
  @IsString()
  public deliveryNotes?: string;

  @IsNotEmpty()
  @IsString()
  public paymentMethod!: string;

  @IsNotEmpty()
  @IsNumber()
  public subtotal!: number;

  @IsNotEmpty()
  @IsNumber()
  public deliveryFee!: number;

  @IsNotEmpty()
  @IsNumber()
  public total!: number;

  // 🔄 Mapeo relacional: Valida que sea un arreglo y que cada elemento cumpla con la clase OrderItemDto
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  public items!: OrderItemDto[];
}