import { IsString, IsNumber, IsOptional, IsUUID, IsInt, IsEnum } from 'class-validator';
import { Size } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiPropertyOptional({ example: 299.99 })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiPropertyOptional({ example: 'pending' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateCartItemDto {
  @ApiProperty({ example: 'uuid-do-carrinho' })
  @IsUUID()
  cartId: string;

  @ApiProperty({ example: 'uuid-do-produto' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  quantity: number;

  @ApiProperty({ enum: ['P', 'M', 'G'], example: 'M' })
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
