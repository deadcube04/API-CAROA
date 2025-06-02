import { IsString, IsNumber, IsOptional, IsUUID, IsInt, IsEnum } from 'class-validator';
import { Size } from '@prisma/client';

export class CreateCartDto {
  @IsOptional()
  @IsNumber()
  totalPrice?: number;
  @IsOptional()
  @IsString()
  status?: string;
}


export class CreateCartItemDto {
  @IsUUID()
  cartId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;

  @IsEnum(Size)
  size: Size; // ou use um enum se preferir
}

export class UpdateCartDto {
  @IsOptional()
  @IsNumber()
  totalPrice?: number;
  @IsOptional()
  @IsString()
  status?: string;
}
