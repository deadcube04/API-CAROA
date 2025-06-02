import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './create-collection.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @ApiPropertyOptional()
  property?: string;
}
