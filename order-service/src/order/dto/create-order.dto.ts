import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  public userId!: string; 

  @IsNotEmpty()
  @IsString()
  public productId!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'La cantidad mínima para generar un pedido es 1.' })
  public quantity!: number; 
}