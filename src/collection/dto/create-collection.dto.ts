import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCollectionDto {
    @ApiProperty({ example: 'Coleção Verão' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Coleção de produtos para o verão' })
    @IsOptional()
    @IsString()
    description?: string;
}
