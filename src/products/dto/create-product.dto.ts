import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Tênis X' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Tênis esportivo' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 199.99 })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'uuid-da-colecao' })
    @IsString()
    collectionId: string;
}