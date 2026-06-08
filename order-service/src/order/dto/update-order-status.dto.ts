import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'])
  public status!: string;
}